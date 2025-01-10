export const userDashboard = async (req, res) => {
    try {
      // The user information is extracted from the token and attached to `req.user`
      const { id, email, role } = req.user;
  
      // Fetch user-specific or role-specific data
      const dashboardData = {
        message: `Welcome to your dashboard, ${email}`,
        role,
        userId: id,
        // You can add any additional data you want to send to the dashboard
        stats: {
          totalUsers: role === 'admin' ? 1500 : undefined, // Example: Only admin sees total users
          recentActivities: [
            { activity: 'Logged in', time: '2 hours ago' },
            { activity: 'Updated profile', time: '1 day ago' },
          ],
        },
      };
  
      return res.status(200).json(dashboardData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error.message);
      return res.status(500).json({ message: `Server error: ${error.message}` });
    }
  };
  