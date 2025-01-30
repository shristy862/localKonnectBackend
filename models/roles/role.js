import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    userPermissions: { type: [String], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Example: ['read', 'delete']
    isBlocked: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Role', RoleSchema);