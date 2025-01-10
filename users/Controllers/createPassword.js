import bcrypt from 'bcryptjs';
import TemporaryUser from '../models/temporaryUserModal.js';
import User from '../models/user.js';

export const createPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const temporaryUser = await TemporaryUser.findOne({ email });

    if (!temporaryUser) {
      return res.status(400).json({ message: 'Temporary user not found' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: temporaryUser.email,
      password: hashedPassword,
      rawPassword: password, 
      userType: temporaryUser.userType,
      isVerified: true,
    });

    await newUser.save();

    await TemporaryUser.deleteOne({ email });

    return res.status(200).json({ message: 'User created successfully and moved to Database' });
  } catch (error) {
    console.error('Error in createPassword:', error.message);
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
