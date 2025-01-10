import TemporaryUser from '../models/temporaryUserModal.js';
import { generateOtp } from '../../utils/generateOTP.js';
import { sendEmail } from '../../utils/emailservice.js';
import { ROLES } from '../../utils/role.js';

export const signup = async (req, res) => {
  const { email, userType } = req.body;

  if (!Object.values(ROLES).includes(userType)) {
    return res.status(400).json({ message: 'Invalid user type' });
  }

  try {
    const existingUser = await TemporaryUser.findOne({ email });

    if (existingUser) {
      const currentTime = new Date();
      const otpExpiryTime = new Date(existingUser.otpExpiry);

      if (currentTime > otpExpiryTime) {
        await TemporaryUser.deleteOne({ email });
      }
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); 

    const temporaryUser = new TemporaryUser({
      email,
      otp,
      otpExpiry,
      userType,
    });

    await temporaryUser.save();

    const message = `Your OTP for signup is: ${otp}. It will expire in 5 minutes.`;
    await sendEmail(email, 'OTP for Signup', message);

    return res.status(200).json({ message: 'OTP sent successfully to your email.' });
  } catch (error) {
    console.error('Error in signup:', error.message); 
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
