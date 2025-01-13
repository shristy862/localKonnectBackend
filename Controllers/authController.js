import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import TemporaryUser from '../models/temporaryUserModal.js';
import { ROLES } from '../constants/role.js';
import { generateOtp } from '../utils/generateOTP.js';
import { sendEmail } from '../utils/emailservice.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  const { email, userType } = req.body;

  // 1. Check for missing fields
  if (!email || !userType) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Email and user type are required',
    });
  }

  // 2. Validate userType
  if (!Object.values(ROLES).includes(userType)) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Invalid user type',
    });
  }

  try {
    // 3. Check if the email already exists in User collection
    const existingRegisteredUser = await User.findOne({ email });
    if (existingRegisteredUser) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Email is already registered. Please login instead.',
      });
    }

    // 4. Check if email exists in TemporaryUser
    const existingTemporaryUser = await TemporaryUser.findOne({ email });

    if (existingTemporaryUser) {
      const currentTime = new Date();
      const otpExpiryTime = new Date(existingTemporaryUser.otpExpiry);

      // 5. Check if OTP has expired
      if (currentTime > otpExpiryTime) {
        await TemporaryUser.deleteOne({ email }); // Delete expired temporary user
      } else {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'OTP is still valid. Please use the existing OTP.',
        });
      }
    }

    // 6. Generate OTP and save temporary user
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const temporaryUser = await TemporaryUser.findOneAndUpdate(
      { email },
      { email, otp, otpExpiry, userType },
      { upsert: true, new: true, runValidators: true }
    );

    // 7. Send OTP via email
    const message = `Your OTP for signup is: ${otp}. It will expire in 5 minutes.`;
    await sendEmail(email, 'OTP for Signup', message);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'OTP sent successfully to your email.',
      data: { email },
    });
  } catch (error) {
    console.error('Error in signup:', error.message);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: `Server error: ${error.message}`,
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  // 1. Check for missing fields
  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Email and OTP are required.',
    });
  }

  try {
    // 2. Find the temporary user by email
    const temporaryUser = await TemporaryUser.findOne({ email });

    if (!temporaryUser) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'No OTP found for this email. Please sign up again.',
      });
    }

    // 3. Check if OTP matches
    if (temporaryUser.otp !== otp) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid OTP. Please try again.',
      });
    }

    // 4. Check if OTP has expired
    const currentTime = new Date();
    const otpExpiryTime = new Date(temporaryUser.otpExpiry);
    if (currentTime > otpExpiryTime) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'OTP has expired. Please sign up again to receive a new OTP.',
      });
    }

    // 5. Mark user as verified in TemporaryUser
    temporaryUser.isVerified = true;
    await temporaryUser.save();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'OTP verified successfully. User is now marked as verified.',
    });
  } catch (error) {
    console.error('Error in OTP verification:', error.message);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: `Server error: ${error.message}`,
    });
  }
};

export const createPassword = async (req, res) => {
  const { email, password } = req.body;

  // 1. Check for missing fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Email and password are required.',
    });
  }

  try {
    // 2. Check if the temporary user exists
    const temporaryUser = await TemporaryUser.findOne({ email });

    if (!temporaryUser) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Temporary user not found. Please verify your email first.',
      });
    }

    // 3. Check if the user already exists in the User collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'User already exists. Please login instead.',
      });
    }

    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create the new user
    const newUser = new User({
      email: temporaryUser.email,
      password: hashedPassword,
      rawPassword: password,
      userType: temporaryUser.userType,
      isVerified: true,
    });

    await newUser.save();

    // 6. Remove the temporary user entry
    await TemporaryUser.deleteOne({ email });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'User created successfully and moved to the database.',
    });
  } catch (error) {
    console.error('Error in createPassword:', error.message);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: `Server error: ${error.message}`,
    });
  }
};

export const loginUsers = async (req, res) => {
  const { email, password } = req.body;

  // 1. Check for missing fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Email and password are required.',
    });
  }

  try {
    // 2. Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'User not found. Please sign up first.',
      });
    }

    // 3. Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid credentials. Please try again.',
      });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.userType }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' } 
    );

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: `Login successful! Welcome ${user.userType}.`,
      token,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: `Server error: ${error.message}`,
    });
  }
};

export const logout = async (req, res) => {
  try {
    // 1. Check if token exists in request header
    const token = req.headers['authorization'];

    if (!token) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'No token provided. Please login first.',
      });
    }

    // 2. Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid or expired token. Please login again.',
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Logout successful.',
    });
  } catch (error) {
    console.error('Error in logout:', error.message);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: `Server error: ${error.message}`,
    });
  }
};
