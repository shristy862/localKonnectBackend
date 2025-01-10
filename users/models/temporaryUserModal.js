import mongoose from 'mongoose';

const temporaryUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true, 
    default: null, 
  },
  otpExpiry: {
    type: Date,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  userType: {
    type: String,
    required: true,
  },
});

const TemporaryUser = mongoose.model('TemporaryUser', temporaryUserSchema);

export default TemporaryUser;
