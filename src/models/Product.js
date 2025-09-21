class Product {
  constructor(id, name, description, price, stock) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.createdAt = new Date();
  }

  // Get product for API responses
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      stock: this.stock,
      createdAt: this.createdAt
    };
  }

  // Check if product is in stock
  isInStock(quantity) {
    return this.stock >= quantity;
  }

  // Update stock after purchase
  updateStock(quantity) {
    if (this.isInStock(quantity)) {
      this.stock -= quantity;
      return true;
    }
    return false;
  }
}

// In-memory storage for products
const products = [];

// Initialize with 3 default products
const initializeProducts = () => {
  const defaultProducts = [
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 199.99,
      stock: 50
    },
    {
      id: 2,
      name: 'Smart Watch',
      description: 'Advanced smartwatch with fitness tracking and notifications',
      price: 299.99,
      stock: 30
    },
    {
      id: 3,
      name: 'Laptop Stand',
      description: 'Adjustable aluminum laptop stand for ergonomic workspace',
      price: 89.99,
      stock: 100
    }
  ];

  for (const productData of defaultProducts) {
    const product = new Product(
      productData.id,
      productData.name,
      productData.description,
      productData.price,
      productData.stock
    );
    products.push(product);
  }
};

// Initialize products
initializeProducts();

module.exports = {
  Product,
  products
};
