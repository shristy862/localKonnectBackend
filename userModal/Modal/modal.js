import mongoose from 'mongoose';

// saving user's personal Details as an embedded document 
const personalDetailsSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: false },

  lastName: { 
    type: String, 
    required: false },

  phoneNo: 
  { type: String, 
    required: false },

  photo: { 
    type: String, 
    required: false },

  cv: { 
    type: String, 
    required: false },

  links: [{ 
    type: String, 
    required: false }],

  gender: { 
    type: String, 
    required: false },

  city: { 
    type: String, 
    required: false },

  languages: { 
    type: String, 
    required: false },

}, { _id: false }); 

const educationalDetailsSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['graduation', 'post-graduation', 'secondary', 'senior-secondary', 'certification'], 
    required: true 
  },
  degree: { 
    type: String, 
    required: true },

  institution: { 
    type: String, 
    required: true },

  passingYear: { 
    type: String, 
    required: true },

  grade: { 
    type: String, 
    required: false },

  fieldOfStudy: { 
    type: String, 
    required: false },

}, { _id: false });

const careerObjectiveSchema = new mongoose.Schema({
  type: String,
}, { timestamps: true });

const workExperienceSchema = new mongoose.Schema(
  {
    designation: { 
      type: String, 
      required: true 
    },
    profile: { 
      type: String, 
      required: true 
    },
    organizationName: { 
      type: String, 
      required: true 
    },
    location: { 
      type: String, 
      required: true 
    },
    jobType: { 
      type: String, 
      enum: ['job', 'internship'], 
      required: true 
    },
    mode: { 
      type: String, 
      enum: ['online', 'in-office', 'hybrid'], 
      required: true 
    },
    startDate: { 
      type: Date, 
      required: true 
    },
    endDate: { 
      type: Date, 
      required: true 
    },
  },
  { _id: false } // Disable the _id field for embedded documents
);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }, rawPassword: { // Add this field to store the raw password temporarily
    type: String,
    required: false // Make it optional
  },
  userType: {
    type: String,
    enum: [, 'company', 'HiringManager', 'accountant','user' ,'administration', 'superadmin', 'HR', 'platformJrHr', 'other'],
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  isVerified: {
    type: Boolean,
    default: false
  },

  // Personal details fields for candidates
  personalDetails: personalDetailsSchema,
  // Educational details array for candidates
  educationalDetails: [educationalDetailsSchema],
  // CareerObjective details for candidates
  careerObjective: { type: String },
  // Work Exp details for candidates
  workExperience: [workExperienceSchema],
  // Company profile fields
  phoneNo: {
    type: String,
    required: false
  },
  location: {
    streetAddress: {
      type: String,
      required: false
    },
    city: {
      type: String,
      required: false
    },
    state: {
      type: String,
      required: false
    },
    zipCode: {
      type: String,
      required: false
    },
  },
  websiteUrl: {
    type: String,
    required: false
  },
  industryType: {
    type: String,
    required: false
  },
  companySize: {
    type: String,
    required: false
  },
  representative: {
    name: {
      type: String,
      required: false
    },
    position: {
      type: String,
      required: false
    }
  },
  registrationNumber: {
    type: String,
    required: false
  },
  gstNumber: {
    type: String,
    required: false
  },

}, { timestamps: true });

export default mongoose.model('User', userSchema);
