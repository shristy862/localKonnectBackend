import Service from '../models/services.js';
import { SERVICES } from '../constants/services.js';
import { PAYMENT_MODES } from '../constants/paymentModes.js';

export const addMultipleServices = async (req, res) => {
  try {
    const { id } = req.user;
    const services = req.body.services; // Expect an array of services in the request body

    // Validate input
    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Services must be an array and cannot be empty.',
      });
    }

    // Validate each service
    for (const service of services) {
      const { serviceName, description, cost, visitCharge, paymentModes } = service;

      if (!serviceName || !description || !cost || !visitCharge || !paymentModes) {
        return res.status(400).json({
          success: false,
          message: 'Each service must have a serviceName, description, cost, visitCharge, and paymentModes.',
        });
      }

      if (!Object.values(SERVICES).includes(serviceName)) {
        return res.status(400).json({
          success: false,
          message: `Invalid serviceName: ${serviceName}. Allowed values are: ${Object.values(SERVICES).join(', ')}.`,
        });
      }

      if (!Array.isArray(paymentModes) || paymentModes.some(mode => !Object.values(PAYMENT_MODES).includes(mode))) {
        return res.status(400).json({
          success: false,
          message: `Invalid paymentModes in service: ${serviceName}. Allowed values are: ${Object.values(PAYMENT_MODES).join(', ')}.`,
        });
      }
    }

    // Prepare and save services
    const servicesToSave = services.map(service => ({
      userId: id,
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
