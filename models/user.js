import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rawPassword: { type: String, required: true }, // For sending credentials
    userType: { type: String, required: true, enum: Object.values(ROLES) },
    isVerified: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to creator
}, { timestamps: true });

export default mongoose.model('User', userSchema);
