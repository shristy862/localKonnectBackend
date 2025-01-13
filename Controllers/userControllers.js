
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
    // Use multer middleware for file upload
    upload.single('profilePic')(req, res, async (error) => {
      try {
        // Check if there was an error during file upload
        if (error) {
          return res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'File upload failed.',
          });
        }
  
        // Check if the file was uploaded
        if (!req.file) {
          return res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'No file uploaded.',
          });
        }
  
        // Get the logged-in user ID from the JWT token
        const { id } = req.user;
  
        // Get the URL of the uploaded profile picture
        const profilePicUrl = req.file.location;
  
        // Update the user's profile with the profile picture URL
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { profilePic: profilePicUrl },
          { new: true }
        );
  
        if (!updatedUser) {
          return res.status(404).json({
            success: false,
            statusCode: 404,
            message: 'User not found.',
          });
        }
  
        // Return the updated user data
        return res.status(200).json({
          success: true,
          statusCode: 200,
          message: 'Profile picture uploaded successfully.',
          profilePicUrl,
          user: {
            email: updatedUser.email,
            profilePic: updatedUser.profilePic,
          },
        });
      } catch (error) {
        console.error('Error uploading profile picture:', error.message);
        return res.status(500).json({
          success: false,
          statusCode: 500,
          message: `Server error: ${error.message}`,
        });
      }
    });
  };