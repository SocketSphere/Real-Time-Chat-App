// backend/src/models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planName: {
    type: String,
    required: true
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'ETB'
  },
  tx_ref: {
    type: String,
    required: true,
    unique: true
  },
  // Store the email used for payment
  userEmail: {
    type: String,
    required: true
  },
  chapa_transaction_id: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'cancelled'],
    default: 'pending'
  },
  payment_date: {
    type: Date
  },
  metadata: {
    type: Object
  }
}, {
  timestamps: true
});

export default mongoose.model('Payment', paymentSchema);