const CheckoutService = require('../services/checkoutService');

class CheckoutController {
  // Process checkout
  static async checkout(req, res) {
    try {
      const { items, paymentMethod } = req.body;
      const userId = req.user.id;

      // Validate input
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Items array is required and must not be empty'
        });
      }

      if (!paymentMethod) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Payment method is required'
        });
      }

      // Validate each item
      for (const item of items) {
        if (!item.productId || !item.quantity || item.quantity <= 0) {
          return res.status(400).json({
            error: 'Validation error',
            message: 'Each item must have productId and quantity (greater than 0)'
          });
        }
      }

      // Process checkout
      const order = CheckoutService.processCheckout(items, paymentMethod, userId);

      res.status(201).json({
        message: 'Checkout completed successfully',
        data: {
          order
        }
      });

    } catch (error) {
      res.status(400).json({
        error: 'Checkout failed',
        message: error.message
      });
    }
  }
}

module.exports = CheckoutController;
