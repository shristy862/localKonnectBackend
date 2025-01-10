import mongoose from 'mongoose';
import { ROLES } from '../../utils/role.js'; 
const temporaryUserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: Number, required: true },
    otpExpiry: { type: Date, required: true },
    userType: { type: String, required: true, enum: Object.values(ROLES) },
});

export default mongoose.model('TemporaryUser', temporaryUserSchema);
