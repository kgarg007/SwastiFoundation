const mongoose = require('mongoose');
const { Schema } = mongoose;

const donationSchema = new Schema({
  donorName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  pan: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  amount: {
    type: Number,
    required: true
  },
  razorpayPaymentId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  receiptId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    required: true,
    default: 'successful'
  }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
