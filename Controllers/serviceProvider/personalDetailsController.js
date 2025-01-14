import PersonalDetails from '../../models/serviceProvider/personalDetailsModal.js';
import { uploadToS3 } from '../../config/idUpload.js';

export const addPersonalDetails = async (req, res) => {
  console.log(req.user);
  try {
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated properly.',
      });
    }

    const { id } = req.user; // Extract user ID from token
    const { name, address } = req.body;

    // Validate that all necessary fields are present
    if (!name || !address || !address.street || !address.city || !address.state || !address.postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields.',
      });
    }

    // Handle image upload if provided
    let image = null;
    if (req.file) {
      const fileUrl = await uploadToS3(req.file, req.file.originalname);
      image = { url: fileUrl, uploadedAt: new Date() };
    }

    // Create a new personal details entry
    const personalDetails = new PersonalDetails({
      userId: id,
      name,
      address,
      image,
    });

    // Save the personal details to the database
    await personalDetails.save();

    return res.status(201).json({
      success: true,
      message: 'Personal details added successfully.',
      data: personalDetails,
    });
  } catch (error) {
    console.error('Error adding personal details:', error.message);

    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// Controller for editing personal details
export const editPersonalDetails = async (req, res) => {
  try {
    // Log the request body for debugging
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated properly.',
      });
    }

    const { id } = req.user; // Extract user ID from token
    const { name, address, govtId } = req.body;

    // Validate that at least one field is provided
    if (!name && !address && !govtId && !req.file) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (name, address, govtId, or file) must be provided to update.',
      });
    }

    // Find the personal details by userId
    const personalDetails = await PersonalDetails.findOne({ userId: id });

    if (!personalDetails) {
      return res.status(404).json({
        success: false,
        message: 'Personal details not found.',
      });
    }

    // Only update the fields that are provided in the request body
    if (name) {
      personalDetails.name = name;
    }

    if (address) {
      // If the address is provided, update the specific fields within the address
      if (address.street) personalDetails.address.street = address.street;
      if (address.city) personalDetails.address.city = address.city;
      if (address.state) personalDetails.address.state = address.state;
      if (address.postalCode) personalDetails.address.postalCode = address.postalCode;
    }

    if (govtId) {
      personalDetails.govtId = govtId; // Update the govtId field
    }

    // Handle image upload if a new file is provided
    if (req.file) {
      // Upload the new image to S3
      const fileUrl = await uploadToS3(req.file, req.file.originalname);
      personalDetails.image = { url: fileUrl, uploadedAt: new Date() };
    }

    // Save the updated personal details to the database
    await personalDetails.save();

    return res.status(200).json({
      success: true,
      message: 'Personal details updated successfully.',
      data: personalDetails,
    });
  } catch (error) {
    console.error('Error updating personal details:', error.message);

    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};
// Controller for getting personal details
export const getPersonalDetails = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated properly.',
      });
    }

    const { id } = req.user; // Extract user ID from token

    // Fetch the user's personal details using their userId
    const personalDetails = await PersonalDetails.findOne({ userId: id });

    if (!personalDetails) {
      return res.status(404).json({
        success: false,
        message: 'Personal details not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Personal details fetched successfully.',
      data: personalDetails,
    });
  } catch (error) {
    console.error('Error fetching personal details:', error.message);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};
// get image
export const getImage = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated.',
      });
    }

    const { id } = req.user; // Get the authenticated user's ID from req.user

    // Find the user's personal details by userId
    const personalDetails = await PersonalDetails.findOne({ userId: id });

    if (!personalDetails || !personalDetails.image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found.',
      });
    }

    // Return the image URL from the database
    return res.status(200).json({
      success: true,
      message: 'Image found.',
      data: personalDetails.image.url, // Return the image URL
    });

  } catch (error) {
    console.error('Error fetching image:', error.message);

    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};
// Controller for deleting personal details
export const deletePersonalDetails = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated properly.',
      });
    }

    const { id } = req.user; // Extract user ID from token

    // Find and delete the user's personal details using their userId
    const personalDetails = await PersonalDetails.findOneAndDelete({ userId: id });

    if (!personalDetails) {
      return res.status(404).json({
        success: false,
        message: 'Personal details not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Personal details deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting personal details:', error.message);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};