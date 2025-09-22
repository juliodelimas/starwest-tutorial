const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const baseUrl = 'http://localhost:3000';

describe('10% Discount Rule - Equivalence Partitioning Tests', function() {
  let authToken;
  let testProduct;

  // Setup: Login and get products before running tests
  before(async function() {
    // Login to get authentication token
    const loginResponse = await chai.request(baseUrl)
      .post('/api/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123'
      });

    expect(loginResponse).to.have.status(200);
    authToken = loginResponse.body.data.token;

    // Get available products for testing
    const productsResponse = await chai.request(baseUrl)
      .get('/api/products');

    expect(productsResponse).to.have.status(200);
    testProduct = productsResponse.body.data.products[0]; // Use first product
  });

  describe('Equivalence Partition 1: Valid Cash Payment (Should receive 10% discount)', function() {
    it('should apply 10% discount when payment method is "cash"', async function() {
      const checkoutData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 2
          }
        ],
        paymentMethod: 'cash'
      };

      const response = await chai.request(baseUrl)
        .post('/api/checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send(checkoutData);

      expect(response).to.have.status(201);
      expect(response.body.data.order).to.have.property('paymentMethod', 'cash');
      expect(response.body.data.order).to.have.property('discount', 10);
      expect(response.body.data.order).to.have.property('discountAmount');
      expect(response.body.data.order).to.have.property('total');
      
      // Verify discount calculation
      const subtotal = response.body.data.order.subtotal;
      const expectedDiscountAmount = subtotal * 0.10;
      const expectedTotal = subtotal - expectedDiscountAmount;
      
      expect(response.body.data.order.discountAmount).to.be.closeTo(expectedDiscountAmount, 0.01);
      expect(response.body.data.order.total).to.be.closeTo(expectedTotal, 0.01);
    });
  });

  describe('Equivalence Partition 2: Valid Credit Card Payment (Should NOT receive discount)', function() {
    it('should NOT apply discount when payment method is "credit_card"', async function() {
      const checkoutData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 1
          }
        ],
        paymentMethod: 'credit_card'
      };

      const response = await chai.request(baseUrl)
        .post('/api/checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send(checkoutData);

      expect(response).to.have.status(201);
      expect(response.body.data.order).to.have.property('paymentMethod', 'credit_card');
      expect(response.body.data.order).to.have.property('discount', 0);
      expect(response.body.data.order).to.have.property('discountAmount', 0);
      
      // Verify no discount applied
      const subtotal = response.body.data.order.subtotal;
      const total = response.body.data.order.total;
      
      expect(total).to.equal(subtotal);
    });
  });

  describe('Equivalence Partition 3: Invalid Payment Method (Should return error)', function() {
    it('should return error when payment method is invalid', async function() {
      const checkoutData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 1
          }
        ],
        paymentMethod: 'paypal' // Invalid payment method
      };

      const response = await chai.request(baseUrl)
        .post('/api/checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send(checkoutData);

      expect(response).to.have.status(400);
      expect(response.body).to.have.property('error');
      expect(response.body).to.have.property('message');
    });

    it('should return error when payment method is empty string', async function() {
      const checkoutData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 1
          }
        ],
        paymentMethod: '' // Empty payment method
      };

      const response = await chai.request(baseUrl)
        .post('/api/checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send(checkoutData);

      expect(response).to.have.status(400);
      expect(response.body).to.have.property('error');
      expect(response.body).to.have.property('message');
    });

    it('should return error when payment method is null', async function() {
      const checkoutData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 1
          }
        ],
        paymentMethod: null // Null payment method
      };

      const response = await chai.request(baseUrl)
        .post('/api/checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send(checkoutData);

      expect(response).to.have.status(400);
      expect(response.body).to.have.property('error');
      expect(response.body).to.have.property('message');
    });

    it('should return error when payment method is missing', async function() {
      const checkoutData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 1
          }
        ]
        // paymentMethod field missing
      };

      const response = await chai.request(baseUrl)
        .post('/api/checkout')
        .set('Authorization', `Bearer ${authToken}`)
        .send(checkoutData);

      expect(response).to.have.status(400);
      expect(response.body).to.have.property('error');
      expect(response.body).to.have.property('message');
    });
  });
});
