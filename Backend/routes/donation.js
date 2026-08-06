const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Donation = require('../model/donation');
const Admin = require('../model/admin');
const auth = require('../middleware/auth');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZOR_KEY_ID,
  key_secret: process.env.RAZOR_SECRET_KEY
});

// ==========================================
// 1. CREATE ORDER (Public)
// ==========================================
router.post('/order', async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || typeof amount !== 'number' || amount < 10) {
      return res.status(400).json({ error: 'Amount must be at least ₹10.' });
    }

    const receiptId = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // convert to paise
      currency: 'INR',
      receipt: receiptId
    });

    res.json({
      orderId: order.id,
      amount: amount,
      receiptId: receiptId,
      razorpayKeyId: process.env.RAZOR_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. VERIFY PAYMENT (Public)
// ==========================================
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, name, email, pan } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !name || !email || !pan) {
      return res.status(400).json({ error: 'All payment fields are required.' });
    }

    // Validate PAN number format (10-digit alphanumeric: 5 letters, 4 numbers, 1 letter)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
    if (!panRegex.test(pan.trim())) {
      return res.status(400).json({ error: 'Invalid PAN card number format.' });
    }

    // Step A: Cryptographically verify the signature
    const hmac = crypto.createHmac('sha256', process.env.RAZOR_SECRET_KEY);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Signature verification failed. Potential tampering.' });
    }

    // Step B: Query Razorpay to fetch order details and verify amount (never trust client amount)
    const order = await razorpay.orders.fetch(razorpay_order_id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found on Razorpay.' });
    }

    const verifiedAmount = order.amount / 100; // paise to rupees

    // Step C: Check for duplicate/replay attack
    const existing = await Donation.findOne({ razorpayPaymentId: razorpay_payment_id });
    if (existing) {
      return res.status(400).json({ error: 'This payment transaction has already been recorded.' });
    }

    // Step D: Record donation in database
    const donation = new Donation({
      donorName: name,
      email: email,
      pan: pan.trim().toUpperCase(),
      amount: verifiedAmount,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      receiptId: order.receipt || `rcpt_${Date.now()}`,
      status: 'successful'
    });

    await donation.save();
    res.json({ success: true, message: 'Payment successfully verified and donation recorded.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. FETCH DONATION RECORDS (Protected & Admin Only)
// ==========================================
router.get('/list', auth, async (req, res) => {
  try {
    // Admin Authorization Check
    const adminUser = await Admin.findById(req.adminId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
    }

    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 4. DELETE DONATION RECORD (Protected & Admin Only)
// ==========================================
router.delete('/:id', auth, async (req, res) => {
  try {
    // Admin Authorization Check
    const adminUser = await Admin.findById(req.adminId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation record not found.' });
    }

    await donation.deleteOne();
    res.json({ success: true, message: 'Donation record deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
