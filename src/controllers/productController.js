const ProductService = require('../services/productService');

class ProductController {
  // Get all products
  static async getAllProducts(req, res) {
    try {
      const products = ProductService.getAllProducts();

      res.status(200).json({
        message: 'Products retrieved successfully',
        data: {
          products
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve products'
      });
    }
  }

  // Get product by ID
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = ProductService.getProductById(parseInt(id));

      if (!product) {
        return res.status(404).json({
          error: 'Product not found',
          message: `Product with ID ${id} does not exist`
        });
      }

      res.status(200).json({
        message: 'Product retrieved successfully',
        data: {
          product: product.toJSON()
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve product'
      });
    }
  }
}

module.exports = ProductController;
