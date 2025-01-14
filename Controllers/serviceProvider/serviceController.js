import Service from '../../models/serviceProvider/serviceModal.js';
import { SERVICES } from '../../constants/services.js';

export const addMultipleServices = async (req, res) => {
  console.log(req.user); // To check if req.user is populated
  const { id } = req.user; // Extract the user ID from req.user
  console.log(id); // To verify the extracted ID

  try {
    const services = req.body.services; 

    // Validate input
    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Services must be an array and cannot be empty.',
      });
    }

    // Validate each service
    for (const service of services) {
      const { serviceName, description, visitCharge } = service;

      if (!serviceName || !description || !visitCharge) {
        return res.status(400).json({
          success: false,
          message: 'Each service must have a serviceName, description, and visitCharge.',
        });
      }

      if (!Object.values(SERVICES).includes(serviceName)) {
        return res.status(400).json({
          success: false,
          message: `Invalid serviceName: ${serviceName}. Allowed values are: ${Object.values(SERVICES).join(', ')}.`,
        });
      }
    }

    // Prepare and save services
    const servicesToSave = services.map(service => ({
      userId: id, // Use the correct ID here
      ...service,
    }));

    const savedServices = await Service.insertMany(servicesToSave);

    return res.status(201).json({
      success: true,
      message: 'Services added successfully.',
      services: savedServices,
    });
  } catch (error) {
    console.error('Error adding multiple services:', error.message);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

export const editService = async (req, res) => {
  try {
    const { serviceId, serviceName, description, visitCharge } = req.body; // Get the serviceId and other fields from the request body
    const userId = req.user.id; // Extract user ID from req.user (set by the authenticateToken middleware)

    // Validate that serviceId is provided in the request body
    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: 'Service ID is required.',
      });
    }

    // Find the service by its ID and user ID
    const service = await Service.findOne({ _id: serviceId, userId });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or you do not have permission to edit this service.',
      });
    }

    // Only update the fields that are provided
    if (serviceName) {
      if (!Object.values(SERVICES).includes(serviceName)) {
        return res.status(400).json({
          success: false,
          message: `Invalid serviceName: ${serviceName}. Allowed values are: ${Object.values(SERVICES).join(', ')}.`,
        });
      }
      service.serviceName = serviceName;
    }

    if (description) {
      service.description = description;
    }

    if (visitCharge) {
      service.visitCharge = visitCharge;
    }

    // Save the updated service
    await service.save();

    return res.status(200).json({
      success: true,
      message: 'Service updated successfully.',
      service,
    });
  } catch (error) {
    console.error('Error updating service:', error.message);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

export const viewServices = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the token

    // Fetch services for the authenticated user
    const services = await Service.find({ userId });

    if (!services || services.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No services found for this user.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Services fetched successfully.',
      services,
    });
  } catch (error) {
    console.error('Error fetching services:', error.message);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.user; // Extract user ID from the token
    const { serviceId } = req.params; // Extract service ID from request parameters

    // Check if the service exists and belongs to the authenticated user
    const service = await Service.findOne({ _id: serviceId, userId: id });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or not authorized to delete.',
      });
    }

    // Delete the service
    await Service.findByIdAndDelete(serviceId);

    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting service:', error.message);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};
