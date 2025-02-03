import mongoose from 'mongoose';

const temporaryUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true },
  userType: { type: String, required: true },
  userPermissions: { type: [String], default: [] }, 
});

temporaryUserSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 0 });

const TemporaryUser = mongoose.model('TemporaryUser', temporaryUserSchema);

export default TemporaryUser;
