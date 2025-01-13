import Profile from '../models/profile.js';
import User from '../models/user.js'; 

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
    console.log('User from token:', req.user); // Log to check the user object in the controller
  
    try {
      // Check if the file is uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'No file uploaded.',
        });
      }
  
      // Check if req.user exists
      if (!req.user) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'User not authenticated properly.',
        });
      }
  
      const { id } = req.user; // Destructure user ID from the token
  
      // Get the S3 URL of the uploaded image
      const profilePicUrl = req.file.location; // The URL of the uploaded file on S3
      console.log('Profile picture URL:', profilePicUrl); // Log the URL for debugging
  
      // Check if the user already has a profile
      let profile = await Profile.findOne({ user: id });
  
      if (!profile) {
        // Create a new profile if not found
        profile = new Profile({
          user: id,
          profilePhoto: profilePicUrl, // Save the profile picture URL
        });
        await profile.save();
  
        // Update the user's reference to the newly created profile
        await User.findByIdAndUpdate(id, { profile: profile._id });
      } else {
        // Update the existing profile
        profile.profilePhoto = profilePicUrl;
        await profile.save();
      }
  
      // Return the updated user data with the profile picture URL
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Profile picture uploaded successfully.',
        profilePicUrl,
        user: {
          email: req.user.email,
          profilePic: profile.profilePhoto, // Return the updated profile picture URL
        },
      });
    } catch (error) {
      console.error('Error uploading profile picture:', error.message);
  
      // Handle different error types
      if (error.name === 'MulterError') {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'File upload failed.',
        });
      }
  
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: `Server error: ${error.message}`,
      });
    }
  };
  
  