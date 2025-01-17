import mongoose from 'mongoose';
import { ROLES } from '../../constants/role.js'; 

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rawPassword: { type: String, required: true },
    userType: { type: String, required: true, enum: Object.values(ROLES) },
    isVerified: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }, 
}, { timestamps: true });

export default mongoose.model('User', userSchema);
