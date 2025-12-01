// backend/src/controllers/paymentController.js
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import axios from 'axios';

// Chapa configuration
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || 'CHASECK_TEST-WLoHD1KO8phF4dU2qyB0zox6bQCZayXx';

// Initialize payment
export const initializePayment = async (req, res) => {
  try {
    console.log('🔔 Payment request received');
    
    const { amount, planName, billingCycle, currency = 'ETB' } = req.body;
    const userId = req.user._id;

    console.log('📝 Request data:', { amount, planName, billingCycle, userId });

    // Generate unique transaction reference
    const tx_ref = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      console.error('❌ User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('👤 User found:', { 
      id: user._id, 
      loginId: user.loginId,
      firstName: user.firstName,
      lastName: user.lastName 
    });

    // Create payment record
    const payment = new Payment({
      userId,
      planName,
      billingCycle,
      amount,
      currency,
      tx_ref,
      status: 'pending'
    });
    await payment.save();

    console.log('💾 Payment record created:', payment._id);

    // Get user email - Chapa requires email
    let userEmail = user.email;
    
    // If user doesn't have email in DB, create one
    if (!userEmail) {
      userEmail = user.loginId.includes('@') 
        ? user.loginId 
        : `${user.loginId}@chat-app.com`;
      console.log('📧 Generated email for Chapa:', userEmail);
    }

    // Prepare Chapa payment data - SIMPLIFIED VERSION
    const paymentData = {
      amount: amount.toString(),
      currency,
      email: userEmail,
      first_name: user.firstName || 'Customer',
      last_name: user.lastName || 'User',
      tx_ref,
      callback_url: `${process.env.BASE_URL || 'http://localhost:5000'}/api/payments/verify`,
      return_url: `${process.env.FRONTEND_URL || 'http://127.0.0.1:5176'}/payment-success`,
      // Remove customization for now, some Chapa versions don't support it
      meta: {
        planName,
        billingCycle,
        userId: userId.toString(),
        paymentId: payment._id.toString()
      }
    };

    console.log('📤 Sending to Chapa API:', { 
      email: paymentData.email,
      amount: paymentData.amount,
      tx_ref: paymentData.tx_ref 
    });

    // Initialize Chapa payment using axios
    const response = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('📥 Chapa API response:', response.data);

    if (response.data.status === 'success') {
      console.log('✅ Payment initialized successfully');
      console.log('🔗 Checkout URL:', response.data.data.checkout_url);
      
      res.json({
        success: true,
        message: 'Payment initialized successfully',
        data: response.data.data,
        paymentId: payment._id
      });
    } else {
      console.error('❌ Chapa responded with failure:', response.data);
      throw new Error(response.data.message || 'Chapa payment failed');
    }

  } catch (error) {
    console.error('💥 Payment initialization error:');
    console.error('- Error message:', error.message);
    console.error('- Response data:', error.response?.data);
    console.error('- Status code:', error.response?.status);
    
    res.status(500).json({
      success: false,
      message: 'Failed to initialize payment',
      error: error.response?.data?.message || error.message,
      details: error.response?.data
    });
  }
};


// Verify payment (keep existing)
export const verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.query;
    console.log('🔍 Verifying payment:', tx_ref);

    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        },
      }
    );

    const paymentData = response.data.data;
    console.log('✅ Payment verification result:', paymentData.status);

    const payment = await Payment.findOne({ tx_ref });
    if (!payment) {
      console.error('❌ Payment not found:', tx_ref);
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?error=payment_not_found`);
    }

    if (paymentData.status === 'success') {
      payment.status = 'success';
      payment.chapa_transaction_id = paymentData.id;
      payment.payment_date = new Date();
      await payment.save();

      // Update subscription
      const expiryDate = new Date();
      if (payment.billingCycle === 'monthly') {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      } else {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      }

      await Subscription.findOneAndUpdate(
        { userId: payment.userId },
        {
          planName: payment.planName,
          billingCycle: payment.billingCycle,
          status: 'active',
          startDate: new Date(),
          expiryDate,
          paymentId: payment._id
        },
        { upsert: true, new: true }
      );

      await User.findByIdAndUpdate(payment.userId, {
        'subscription.plan': payment.planName,
        'subscription.status': 'active',
        'subscription.expiresAt': expiryDate
      });

      console.log('✅ Payment successful, redirecting...');
      res.redirect(`${process.env.FRONTEND_URL || 'http://127.0.0.1:5176'}/payment-success?tx_ref=${tx_ref}`);
    } else {
      payment.status = 'failed';
      await payment.save();
      res.redirect(`${process.env.FRONTEND_URL}/payment-failed?tx_ref=${tx_ref}`);
    }
  } catch (error) {
    console.error('❌ Verification error:', error.message);
    res.redirect(`${process.env.FRONTEND_URL}/payment-failed?error=verification_failed`);
  }
};

// Get payment history (keep existing)
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .select('planName billingCycle amount status payment_date tx_ref');

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history',
      error: error.message
    });
  }
};