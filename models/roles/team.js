import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true }, 
    teamMembers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String },
        userType: { type: String, required: true },
        designation: { type: String },
      }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
  { timestamps: true } 
);

export default mongoose.model('Team', teamSchema);
