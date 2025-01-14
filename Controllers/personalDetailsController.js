import { uploadToS3 } from '../config/pictureUpload.js';
import PersonalDetails from '../models/personalDetails.js';

export const addPersonalDetails = async (req, res) => {
  try {
    const { id } = req.user; // Extract user ID from form-data
    const { name, phone, city, pincode } = req.body;
    let address = req.body.address; // Address comes as a stringified JSON

    // Parse the address field (stringified JSON) into an array
    try {
      address = JSON.parse(address);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid address format. Must be a valid JSON array.',
      });
    }

    // Validate the address format
    if (!Array.isArray(address) || address.some(item => !item.type || !item.value)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid address format. Each item must have a "type" and "value".',
      });
    }

    // Optional: Validate the address types
    const allowedAddressTypes = ['houseNo', 'locality', 'city', 'state'];
    const invalidTypes = address.filter(item => !allowedAddressTypes.includes(item.type));
    if (invalidTypes.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid address types. Allowed types: ${allowedAddressTypes.join(', ')}`,
      });
    }

    // Check if a file (government ID) is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No government ID file uploaded.',
      });
    }

    // Upload the file to S3
    const govtIdUrl = await uploadToS3(req.file, req.file.originalname, 'personalid');

    // Check if personal details already exist
    const existingPersonalDetails = await PersonalDetails.findOne({ userId: id });
    if (existingPersonalDetails) {
      return res.status(409).json({
        success: false,
        message: 'Personal details already exist. Please use the edit endpoint.',
      });
    }

    // Save personal details
    const personalDetails = new PersonalDetails({
      userId: id,
      name,
      phone,
      city,
      pincode,
      address,
      govtIdUrl,
    });
    await personalDetails.save();

    return res.status(201).json({
      success: true,
      message: 'Personal details added successfully.',
      personalDetails,
    });
  } catch (error) {
    console.error('Error adding personal details:', error.message);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

  
// Controller to edit personal details
export const editPersonalDetails = async (req, res) => {
  try {
    const { id } = req.user; // Extract user ID from token or form-data
    const { name, phone, city, pincode } = req.body;
    let address = req.body.address; // Address comes as a stringified JSON

    // Parse address field (stringified JSON) into an array
    if (address) {
      try {
        address = JSON.parse(address);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'Invalid address format. Must be a valid JSON array.',
        });
      }

      // Validate the address format
      if (!Array.isArray(address) || address.some(item => !item.type || !item.value)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid address format. Each item must have a "type" and "value".',
        });
      }
    }

    // Fetch personal details from the database
    const personalDetails = await PersonalDetails.findOne({ userId: id });

    if (!personalDetails) {
      return res.status(404).json({
        success: false,
        message: 'Personal details not found. Please add your details first.',
      });
    }

    // Check if a new government ID is uploaded
    if (req.file) {
      if (!personalDetails.govtIdUrl) {
        return res.status(400).json({
          success: false,
          message: 'No existing government ID found. Please add your personal details first.',
        });
      }

      // Upload the new file to S3 and update the government ID URL
      const newGovtIdUrl = await uploadToS3(req.file, req.file.originalname, 'personalid');
      personalDetails.govtIdUrl = newGovtIdUrl;
    }

    // Update other personal details if provided
    personalDetails.name = name || personalDetails.name;
    personalDetails.phone = phone || personalDetails.phone;
    personalDetails.city = city || personalDetails.city;
    personalDetails.pincode = pincode || personalDetails.pincode;
    personalDetails.address = address || personalDetails.address;

    // Save updated personal details
    await personalDetails.save();

    return res.status(200).json({
      success: true,
      message: 'Personal details updated successfully.',
      personalDetails,
    });
  } catch (error) {
    console.error('Error editing personal details:', error.message);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// Controller to get personal details
export const viewPersonalDetails = async (req, res) => {
  try {
    const { id } = req.user; // Extract user ID from the token
    const { userId } = req.query; // Admin can specify another user's ID via query parameter

    // Determine whose details to fetch
    const targetUserId = userId || id;

    // Fetch personal details from the database
    const personalDetails = await PersonalDetails.findOne({ userId: targetUserId });

    if (!personalDetails) {
      return res.status(404).json({
        success: false,
        message: 'Personal details not found for the specified user.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Personal details fetched successfully.',
      personalDetails,
    });
  } catch (error) {
    console.error('Error fetching personal details:', error.message);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};
// Controller to delete personal details
export const deletePersonalDetails = async (req, res) => {
  try {
    const { id } = req.user; // Extract user ID from token
    const { userId } = req.query; // Admin can specify another user's ID via query parameter

    // Determine whose details to delete
    const targetUserId = userId || id;

    // Check if personal details exist for the specified user
    const personalDetails = await PersonalDetails.findOne({ userId: targetUserId });

    if (!personalDetails) {
      return res.status(404).json({
        success: false,
        message: 'Personal details not found for the specified user.',
      });
    }

    // Delete personal details from the database
    await PersonalDetails.deleteOne({ userId: targetUserId });

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