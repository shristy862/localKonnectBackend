import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceName: {
    type: String,
    required: true, // No enum constraint, allowing any string
  },
  description: { type: String, required: true },
  visitCharge: { type: Number, required: true }, 
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
