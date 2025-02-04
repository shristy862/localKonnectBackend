import mongoose from 'mongoose';

const profilePictureSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profilePhoto: { type: String, required: true }, 
});

const ProfilePicture = mongoose.model('ProfilePicture', profilePictureSchema);
export default ProfilePicture;
