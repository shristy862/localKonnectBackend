import mongoose from 'mongoose';

const temporaryUserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: Number, required: true },
    otpExpiry: { type: Date, required: true },
    userType: { type: String, required: true, enum: Object.values(ROLES) },
});

export default mongoose.model('TemporaryUser', temporaryUserSchema);
