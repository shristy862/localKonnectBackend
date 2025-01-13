import ProfilePicture from '../models/profilePicture.js';
import User from '../models/user.js'; 
import { uploadToS3 } from '../config/pictureUpload.js';

// Controller for user dashboard
export const userDashboard = async (req, res) => {
    try {
      // Ensure the user is authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'Authentication required. No token provided.',
        });
      }
  
      const { id, email, role } = req.user;
  
      // Fetch user data from the database
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: 'User not found.',
        });
      }
  
      // Prepare dashboard data
      const dashboardData = {
        message: `Welcome to your dashboard, ${email}`,
        role,
        userId: id,
        userInfo: {
          email: user.email,
          userType: user.userType,
          profileStatus: user.profileStatus || 'Complete',
        },
        stats: {
          totalUsers: role === 'admin' ? 1500 : undefined,
          recentActivities: [
            { activity: 'Logged in', time: '2 hours ago' },
            { activity: 'Updated profile', time: '1 day ago' },
          ],
        },
      };
  
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: dashboardData.message,
        dashboardData,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error.message);
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Invalid user ID format.',
        });
      }
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: `Server error: ${error.message}`,
      });
    }
  };
// Controller for uploading profile picture
export const uploadProfilePicture = async (req, res) => {
  console.log('User from token:', req.user);

  try {
    // Check if the file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.',
      });
    }

    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated properly.',
      });
    }

    const { id } = req.user; // Extract user ID from token
    const fileName = req.file.originalname; // Get the file name
    const profilePicUrl = await uploadToS3(req.file, fileName); // Upload to S3 and get the file URL

    console.log('Profile picture URL:', profilePicUrl);

    // Check if the uploaded URL already exists in the database
    const existingProfilePic = await ProfilePicture.findOne({ profilePhoto: profilePicUrl });
    if (existingProfilePic) {
      return res.status(409).json({
        success: false,
        message: 'This profile picture is already uploaded. You can try to edit the picture instead.',
      });
    }

    // Check if the user already has a profile picture
    let profilePicture = await ProfilePicture.findOne({ userId: id });

    if (!profilePicture) {
      // Create a new profile picture entry
      profilePicture = new ProfilePicture({
        userId: id,
        profilePhoto: profilePicUrl,
      });
      await profilePicture.save();
    } else {
      // Update the existing profile picture
      profilePicture.profilePhoto = profilePicUrl;
      await profilePicture.save();
    }

    // Return the updated profile picture details
    return res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully.',
      profilePicUrl,
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error.message);

    if (error.name === 'MulterError') {
      return res.status(400).json({
        success: false,
        message: 'File upload failed.',
      });
    }

    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// Controller to get the profile picture of a user
export const getProfilePicture = async (req, res) => {
  try {
    // Get the user ID from the JWT token
    const { id } = req.user;

    // Find the user's profile
    const profile = await ProfilePicture.findOne({ userId: id });

    // Check if the profile exists
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found.',
      });
    }

    // Return the profile picture URL
    return res.status(200).json({
      success: true,
      profilePicUrl: profile.profilePhoto,  // The URL of the profile picture
    });
  } catch (error) {
    console.error('Error fetching profile picture:', error.message);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};
// edit profile pic 
export const editProfilePicture = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated properly.',
      });
    }

    const { id } = req.user; // Extract user ID from token

    // Check if the file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.',
      });
    }

    // Log the uploaded file data for debugging
    console.log('Uploaded file:', req.file); // Check if file is present

    // Upload the file to S3 and get the file URL
    const profilePicUrl = await uploadToS3(req.file, req.file.originalname);

    // Log the URL for debugging
    console.log('Profile picture URL:', profilePicUrl);

    // Find the existing profile picture for the user
    const profilePicture = await ProfilePicture.findOne({ userId: id });

    if (!profilePicture) {
      return res.status(404).json({
        success: false,
        message: 'No existing profile picture found.',
      });
    }

    // Update the profile picture URL in the database
    profilePicture.profilePhoto = profilePicUrl; // Assign the S3 URL
    await profilePicture.save();

    // Return the updated profile picture details
    return res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully.',
      profilePicUrl,
    });
  } catch (error) {
    console.error('Error updating profile picture:', error.message);

    if (error.name === 'MulterError') {
      return res.status(400).json({
        success: false,
        message: 'File upload failed.',
      });
    }

    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};
