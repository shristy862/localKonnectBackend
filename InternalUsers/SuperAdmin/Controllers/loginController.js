import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../../EasyjobBackend/userModal/Modal/modal.js';

export const loginSuperAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    // check weather the user exists
    if (!user || user.userType !== 'superadmin') {
      return res.status(401).json({ message: 'Invalid credentials or not a SuperAdmin' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: { id: user._id, email: user.email, userType: user.userType }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
