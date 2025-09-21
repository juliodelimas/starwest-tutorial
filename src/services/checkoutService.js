const ProductService = require('./productService');

class CheckoutService {
  // Process checkout with payment rules
  static processCheckout(items, paymentMethod, userId) {
    // Validate payment method
    if (!['cash', 'credit_card'].includes(paymentMethod)) {
      throw new Error('Invalid payment method. Only "cash" or "credit_card" are accepted.');
    }

    // Check product availability
    const unavailableItems = ProductService.checkProductAvailability(items);
    if (unavailableItems.length > 0) {
      throw new Error(`Some items are not available: ${JSON.stringify(unavailableItems)}`);
    }

    // Calculate totals
    const checkoutDetails = this.calculateTotals(items, paymentMethod);
    
    // Update product stock
    const stockUpdateResults = ProductService.updateProductStock(items);
    
    // Create order
    const order = {
      id: Date.now(), // Simple ID generation
      userId,
      items: items.map(item => ({
        ...item,
        product: ProductService.getProductById(item.productId).toJSON()
      })),
      paymentMethod,
      ...checkoutDetails,
      stockUpdateResults,
      createdAt: new Date()
    };

    return order;
  }

  // Calculate totals with payment method rules
  static calculateTotals(items, paymentMethod) {
    let subtotal = 0;
    let discount = 0;
    let discountAmount = 0;

    // Calculate subtotal
    for (const item of items) {
      const product = ProductService.getProductById(item.productId);
      if (product) {
        subtotal += product.price * item.quantity;
      }
    }

    // Apply discount for cash payments (10% discount)
    if (paymentMethod === 'cash') {
      discount = 10; // 10% discount
      discountAmount = subtotal * (discount / 100);
    }

    const total = subtotal - discountAmount;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discount,
      discountAmount: Math.round(discountAmount * 100) / 100,
      total: Math.round(total * 100) / 100
    };
  }
}

module.exports = CheckoutService;
