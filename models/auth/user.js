import mongoose from 'mongoose';
import { ROLES } from '../../constants/role.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rawPassword: { type: String, required: true }, // Store unhashed password for temporary use
    status: { type: String, default: 'pending' }, // Pending status by default
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceProvider',
      required: function () {
        return this.userType === 'serviceProvider'; // Required only if userType is 'serviceProvider'
      },
    },
    userType: { type: String, required: true, enum: Object.values(ROLES) }, // Role of the user
    isVerified: { type: Boolean, default: false }, // Email/Account verification status
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who created this account
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }, // Link to user profile
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who added this user (if applicable)
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
