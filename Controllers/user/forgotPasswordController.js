import User from '../../models/auth/user.js';
import TemporaryUser from '../../models/auth/temporaryUserModal.js';
import { generateOtp } from '../../utils/generateOTP.js';
import { sendEmail } from '../../utils/emailservice.js';

export const requestOtp = async (req, res) => {
  const { email, userType } = req.body;

  try {
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); 

    // Upsert the temporary user
    await TemporaryUser.findOneAndUpdate(
      { email },
      { email, otp, otpExpiry, userType },
      { upsert: true, new: true }
    );

    await sendEmail(email, 'Password Reset OTP', `Your OTP is: ${otp}`);
    res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error requesting OTP:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const tempUser = await TemporaryUser.findOne({ email, otp });
  
      if (!tempUser || tempUser.otpExpiry < Date.now()) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }
  
      res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };


export const resetPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  try {
    const tempUser = await TemporaryUser.findOne({ email });
    if (!tempUser) {
      return res.status(400).json({ success: false, message: 'OTP verification required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = password; // Hash the password before saving
    await user.save();

    // Remove the temporary user record after successful password reset
    await TemporaryUser.deleteOne({ email });

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
