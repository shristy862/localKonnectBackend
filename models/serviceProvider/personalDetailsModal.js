import mongoose from 'mongoose';

// Address Schema
const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
});

// Image Schema
const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

// Personal Details Schema
const personalDetailsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: { type: addressSchema, required: true },
  image: { type: imageSchema, required: false }, 
});


const PersonalDetails = mongoose.model('PersonalDetails', personalDetailsSchema);
export default PersonalDetails;
