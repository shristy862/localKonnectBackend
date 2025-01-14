import mongoose from 'mongoose';
const personalDetailsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    address: {
      type: [{
        type: {
          type: String, 
          enum: ['houseNo', 'locality', 'city', 'state'], // Possible address keys
          required: true,
        },
        value: { 
          type: String, 
          required: true, 
        },
      }],
      required: true,
    },
    govtIdUrl: { type: String, required: true },
  });
  
  const PersonalDetails = mongoose.model('PersonalDetails', personalDetailsSchema);
  export default PersonalDetails;  