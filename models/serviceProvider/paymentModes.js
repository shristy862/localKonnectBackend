import mongoose from 'mongoose';

const paymentModeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PaymentMode = mongoose.model('PaymentMode', paymentModeSchema);

export default PaymentMode;
