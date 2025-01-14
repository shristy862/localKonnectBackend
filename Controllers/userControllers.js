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
