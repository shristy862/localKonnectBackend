import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true }, // Optional, you can add team name
    teamMembers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String },
        userType: { type: String, required: true },
        designation: { type: String }, // 'designation' from the db
      }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
  { timestamps: true } // Optional: to track when the team is created/updated
);

export default mongoose.model('Team', teamSchema);
