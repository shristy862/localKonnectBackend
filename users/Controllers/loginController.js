import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; 

export const loginUsers = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.userType }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' } // Token expiry time
    );

    return res.status(200).json({
      message: `Login successful! Welcome ${user.userType}`,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.userType,
      },
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
