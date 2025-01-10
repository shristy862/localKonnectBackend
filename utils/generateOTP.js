
export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000); // Always returns a 6-digit number
  };
  