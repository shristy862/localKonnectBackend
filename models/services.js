import mongoose from 'mongoose';
import { SERVICES } from '../constants/services.js';
import { PAYMENT_MODES } from '../constants/paymentModes.js';

const serviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceName: {
    type: String,
    required: true,
    enum: Object.values(SERVICES),
  },
  description: { type: String, required: true },
  cost: { type: Number, required: true },
  visitCharge: { type: Number, required: true }, 
  paymentModes: {
    type: [String],
    required: true,
    enum: Object.values(PAYMENT_MODES),  },
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
