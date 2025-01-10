import TemporaryUser from '../models/temporaryUserModal.js';

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const temporaryUser = await TemporaryUser.findOne({ email });

    if (!temporaryUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (temporaryUser.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if the OTP has expired
    if (temporaryUser.otpExpiry < Date.now()) {
      temporaryUser.otp = null; // Remove OTP
      temporaryUser.isVerified = false; 

      // Save the updated temporary user document
      await temporaryUser.save();

      return res.status(400).json({
        message: 'OTP has expired. Please request a new one.',
      });
    }

    temporaryUser.isVerified = true;

    await temporaryUser.save();

    return res.status(200).json({
      message: 'OTP verified successfully. User is now verified.',
    });
  } catch (error) {
    console.error('Error in OTP verification:', error.message);
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
