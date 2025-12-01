// backend/src/routes/paymentRoutes.js
import express from 'express';
import {
  initializePayment,
  verifyPayment,
  getPaymentHistory
} from '../controllers/paymentController.js';
import auth from '../middleware/auth.js'; // Change this line

const router = express.Router();

// Protected routes - use 'auth' instead of 'protect'
router.post('/initialize', auth, initializePayment);
router.get('/history', auth, getPaymentHistory);

// Public route for Chapa callback
router.get('/verify', verifyPayment);

export default router;