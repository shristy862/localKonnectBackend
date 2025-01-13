import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    profilePhoto: { type: String },
    personalDetails: {
      firstName: { type: String },
      lastName: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
    },
    professionalDetails: {
      jobTitle: { type: String },
      companyName: { type: String },
      experience: { type: String },
      skills: [{ type: String }],
    },
    servicesOffered: [{ type: String }], // Services the user offers
    availability: {
      days: [{ type: String }],
      hours: { type: String },
    },
    paymentMethods: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
