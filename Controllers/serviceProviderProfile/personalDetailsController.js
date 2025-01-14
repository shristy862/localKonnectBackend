import PersonalDetails from '../../models/serviceProvider/personalDetailsModal.js';

export const addPersonalDetails = async (req, res) => {
  console.log('User from token:', req.user);  
    console.log('Request body:', req.body);    

  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated properly.',
      });
    }

    const { id } = req.user;  // Extract user ID from token

    // Destructure the personal details from the request body
    const { name, address } = req.body;

    // Validate that all necessary fields are present
    if (!name || !address || !address.street || !address.city || !address.state || !address.postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields.',
      });
    }

    // Create a new personal details entry
    const personalDetails = new PersonalDetails({
      userId: id,
      name,
      address,
    });

    // Save the personal details to the database
    await personalDetails.save();

    // Return success response
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
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated properly.',
      });
    }

    const { id } = req.user; // Extract user ID from token
    const { name, address } = req.body; // Extract name and address from the request body

    // Check if the required fields are present
    if (!name || !address || !address.street || !address.city || !address.state || !address.postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields.',
      });
    }

    // Find the user's personal details using their userId
    let personalDetails = await PersonalDetails.findOne({ userId: id });

    if (!personalDetails) {
      return res.status(404).json({
        success: false,
        message: 'Personal details not found.',
      });
    }

    // Update the personal details
    personalDetails.name = name;
    personalDetails.address = address;

    // Save the updated personal details
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