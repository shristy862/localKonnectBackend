import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rawPassword: { type: String, required: true },
    status: { type: String, default: 'pending' },
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceProvider',
      required: function () {
        return this.userType === 'serviceProvider';
      },
    },
    userType: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userPermissions: { type: [String], default: [] }, 
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
