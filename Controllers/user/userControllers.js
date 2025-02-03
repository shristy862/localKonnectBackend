import User from '../../models/auth/user.js'; 
import Service from '../../models/serviceProvider/serviceModal.js'; 

// Controller for user dashboard
export const dashboard = async (req, res) => {
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

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'User not found.',
      });
    }

    // Fetch all services
    const services = await Service.find({});

    const dashboardData = {
      message: `Welcome to your dashboard, ${user.userType}`,
      role,
      userId: id,
      userInfo: {
        email: user.email,
        userType: user.userType,
        profileStatus: user.profileStatus || 'Complete',
        userPermissions: user.userPermissions,
      },
      services: services.map(service => ({
        serviceId: service._id,
        userId: service.userId,
        serviceName: service.serviceName,
        description: service.description,
        visitCharge: service.visitCharge,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      })),
    };

    return res.status(200).json({
      success: true,
      statusCode: 200,
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
