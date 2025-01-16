import Service from '../../models/serviceProvider/serviceModal.js';

// Get all services
export const getServices = async (req, res) => {
  console.log(`User ID from token: ${req.user.id}`); // Log the userId from the token

  try {
    const services = await Service.find({ userId: req.user.id });
    
    if (!services ) {
      return res.status(404).json({ message: 'No services found' });
    }

    res.status(200).json(services);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ message: 'Error fetching services: ' + err.message });
  }
};

// Get a single service by ID
export const getServiceById = async (req, res) => {
  console.log(`User ID from getbyId route: ${req.user.id}`); 

  try {
    const service = await Service.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (err) {
    console.error('Error fetching service:', err);
    res.status(500).json({ message: 'Error fetching service: ' + err.message });
  }
};

// Create a new service
export const createService = async (req, res) => {
  console.log(`User ID from token: ${req.user.id}`); // Log the userId from the token

  const { serviceName, description, visitCharge } = req.body;

  if (!serviceName || !description || !visitCharge) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newService = new Service({
      userId: req.user.id,
      serviceName,
      description,
      visitCharge,
    });

    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ message: 'Error creating service: ' + err.message });
  }
};

// Update a service by ID
export const updateService = async (req, res) => {
  console.log(`User ID from token: ${req.user.id}`); // Log the userId from the token

  const { serviceName, description, visitCharge } = req.body;

  if (!serviceName || !description || !visitCharge) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const updatedService = await Service.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found or unauthorized' });
    }

    res.status(200).json(updatedService);
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ message: 'Error updating service: ' + err.message });
  }
};

// Delete a service by ID
export const deleteService = async (req, res) => {
  console.log(`User ID from token: ${req.user.id}`); // Log the userId from the token

  try {
    const deletedService = await Service.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found or unauthorized' });
    }

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ message: 'Error deleting service: ' + err.message });
  }
};
