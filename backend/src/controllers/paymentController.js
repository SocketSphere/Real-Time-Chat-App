// backend/src/controllers/paymentController.js
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import axios from 'axios';

// Chapa configuration
const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

// Helper function to validate and get email
const getValidEmailForChapa = (user) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (emailRegex.test(user.loginId)) {
    console.log('✅ LoginId is a valid email:', user.loginId);
    return user.loginId;
  }
  
  const cleanLoginId = user.loginId
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 30);
  
  const timestamp = Date.now().toString().slice(-6);
  const generatedEmail = `${cleanLoginId}${timestamp}@chat-app.com`;
  
  console.log('📧 Generated email for Chapa:', generatedEmail);
  return generatedEmail;
};

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

    // Get valid email for Chapa
    const userEmail = getValidEmailForChapa(user);
    console.log('📧 Email for Chapa payment:', userEmail);

    // Create payment record
    const payment = new Payment({
      userId,
      planName,
      billingCycle,
      amount,
      currency,
      tx_ref,
      status: 'pending',
      userEmail
    });
    await payment.save();

    console.log('💾 Payment record created:', payment._id);

    // 🔥 CRITICAL FIX: Use ONLY callback_url, NOT return_url
    const paymentData = {
      amount: amount.toString(),
      currency,
      email: userEmail,
      first_name: user.firstName || 'Customer',
      last_name: user.lastName || 'User',
      tx_ref,
      // 🔥 ONLY callback_url - Chapa will call this after payment
      callback_url: `${process.env.BASE_URL || 'http://localhost:5000'}/api/payments/verify`,
      // ❌ REMOVE return_url - This bypasses verification
      return_url: `${process.env.FRONTEND_URL}/payment-success?tx_ref=${tx_ref}`,
      meta: {
        planName,
        billingCycle,
        userId: userId.toString(),
        paymentId: payment._id.toString(),
        loginId: user.loginId
      }
    };

    console.log('📤 Sending to Chapa API:', { 
      email: paymentData.email,
      amount: paymentData.amount,
      tx_ref: paymentData.tx_ref,
      callback_url: paymentData.callback_url
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
    console.error('💥 Payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize payment',
      error: error.message
    });
  }
};

// In backend/src/controllers/paymentController.js
export const verifyPayment = async (req, res) => {
  try {
    const { tx_ref, callback, status } = req.query;
    console.log('🔍 VERIFYING PAYMENT - Chapa callback received:', { tx_ref, callback, status });
    
    // Check if this is a JSONP request
    const isJsonp = callback && typeof callback === 'string';
    
    if (!tx_ref) {
      console.error('❌ No transaction reference in callback');
      if (isJsonp) {
        return res.jsonp({ success: false, error: 'No transaction reference' });
      }
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?error=no_tx_ref`);
    }

    // Verify with Chapa
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        },
      }
    );

    const chapaData = response.data.data;
    console.log('✅ Chapa verification status:', chapaData.status);

    // Find payment record
    const payment = await Payment.findOne({ tx_ref });
    if (!payment) {
      console.error('❌ Payment record not found:', tx_ref);
      if (isJsonp) {
        return res.jsonp({ success: false, error: 'Payment not found' });
      }
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?error=payment_not_found`);
    }

    if (chapaData.status === 'success') {
      console.log('✅ Payment successful, updating records...');
      
      // Update payment status
      payment.status = 'success';
      payment.chapa_transaction_id = chapaData.id;
      payment.payment_date = new Date();
      payment.metadata = chapaData;
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

      console.log('🎉 All records updated');
      
      // Handle JSONP response
      if (isJsonp) {
        console.log('📤 Sending JSONP response to Chapa');
        return res.jsonp({
          success: true,
          redirect_url: `${process.env.FRONTEND_URL || 'http://127.0.0.1:5176'}/payment-success?tx_ref=${tx_ref}&plan=${payment.planName}&amount=${payment.amount}&currency=${payment.currency}&billingCycle=${payment.billingCycle}&status=success`
        });
      }
      
      // Normal redirect
      const successUrl = new URL(`${process.env.FRONTEND_URL || 'http://127.0.0.1:5176'}/payment-success`);
      successUrl.searchParams.append('tx_ref', tx_ref);
      successUrl.searchParams.append('plan', payment.planName);
      successUrl.searchParams.append('amount', payment.amount.toString());
      successUrl.searchParams.append('currency', payment.currency || 'ETB');
      successUrl.searchParams.append('billingCycle', payment.billingCycle);
      successUrl.searchParams.append('paymentId', payment._id.toString());
      successUrl.searchParams.append('chapa_id', chapaData.id || '');
      successUrl.searchParams.append('status', 'success');
      successUrl.searchParams.append('date', new Date().toISOString());
      
      console.log('🔗 Redirecting to success page:', successUrl.toString());
      res.redirect(successUrl.toString());
      
    } else {
      console.log('❌ Payment failed with status:', chapaData.status);
      
      payment.status = 'failed';
      payment.metadata = chapaData;
      await payment.save();

      // Handle JSONP for failure
      if (isJsonp) {
        return res.jsonp({
          success: false,
          redirect_url: `${process.env.FRONTEND_URL}/payment-failed?tx_ref=${tx_ref}&status=${chapaData.status}`
        });
      }
      
      const failUrl = new URL(`${process.env.FRONTEND_URL}/payment-failed`);
      failUrl.searchParams.append('tx_ref', tx_ref);
      failUrl.searchParams.append('status', chapaData.status);
      res.redirect(failUrl.toString());
    }
  } catch (error) {
    console.error('❌ Verification error:', error.message);
    
    // Handle JSONP error
    if (req.query.callback) {
      return res.jsonp({
        success: false,
        error: 'verification_failed',
        message: error.message
      });
    }
    
    const failUrl = new URL(`${process.env.FRONTEND_URL}/payment-failed`);
    failUrl.searchParams.append('error', 'verification_failed');
    if (req.query.tx_ref) {
      failUrl.searchParams.append('tx_ref', req.query.tx_ref);
    }
    res.redirect(failUrl.toString());
  }
};

// Get payment history
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .select('planName billingCycle amount status payment_date tx_ref userEmail');

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