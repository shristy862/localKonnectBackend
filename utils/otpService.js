import TemporaryUser from '../models/auth/temporaryUserModal.js';

export const verifyOtp = async (email, otp) => {
  try {
    const tempUserRecord = await TemporaryUser.findOne({ email });

    if (tempUserRecord) {
      const isOtpValid = tempUserRecord.otp === parseInt(otp) && tempUserRecord.otpExpiry >= Date.now();
      
      return {
        isValid: isOtpValid,
        tempRecord: tempUserRecord,
        type: tempUserRecord.userType,  
      };
    }

    return { isValid: false, type: null };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { isValid: false, type: null };
  }
};
