const express = require('express');
const router = express.Router();
const CheckoutController = require('../controllers/checkoutController');
const { authenticateToken } = require('../middleware/auth');

// Protected routes - authentication required
router.post('/', authenticateToken, CheckoutController.checkout);

module.exports = router;
