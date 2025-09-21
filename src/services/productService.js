const { products } = require('../models/Product');

class ProductService {
  // Get all products
  static getAllProducts() {
    return products.map(product => product.toJSON());
  }

  // Get product by ID
  static getProductById(productId) {
    return products.find(p => p.id === productId);
  }

  // Check if products are available in stock
  static checkProductAvailability(items) {
    const unavailableItems = [];
    
    for (const item of items) {
      const product = this.getProductById(item.productId);
      
      if (!product) {
        unavailableItems.push({
          productId: item.productId,
          reason: 'Product not found'
        });
      } else if (!product.isInStock(item.quantity)) {
        unavailableItems.push({
          productId: item.productId,
          name: product.name,
          requestedQuantity: item.quantity,
          availableStock: product.stock,
          reason: 'Insufficient stock'
        });
      }
    }
    
    return unavailableItems;
  }

  // Update product stock after purchase
  static updateProductStock(items) {
    const results = [];
    
    for (const item of items) {
      const product = this.getProductById(item.productId);
      
      if (product && product.updateStock(item.quantity)) {
        results.push({
          productId: item.productId,
          name: product.name,
          quantity: item.quantity,
          remainingStock: product.stock,
          success: true
        });
      } else {
        results.push({
          productId: item.productId,
          success: false,
          reason: 'Failed to update stock'
        });
      }
    }
    
    return results;
  }
}

module.exports = ProductService;
