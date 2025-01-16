import PersonalDetails from '../../models/serviceProvider/personalDetailsModal.js'; 
import { uploadToS3 } from '../../config/idProofUpload.js'; 

// Add personal details
export const addPersonalDetails = async (req, res) => {
  try {
    // Get userId from the token (req.user is populated by authentication middleware)
    const id = req.user.id;

    // Check if personal details already exist for the given userId
    const existingDetails = await PersonalDetails.findOne({userId: req.user.id});

    if (existingDetails) {
      // If personal details exist, throw an error with a 400 status code
      return res.status(400).json({ message: 'Personal details already exist for this user' });
    }

    // Upload the image to S3 if it exists in the request
    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToS3(req.file, req.file.originalname);
    }

    // Create new personal details
    const newPersonalDetails = new PersonalDetails({
      userId: id, // Use userId from the token
      name: req.body.name,
      address: {
        street: req.body.address.street,
        city: req.body.address.city,
        state: req.body.address.state,
        postalCode: req.body.address.postalCode,
      },
      image: imageUrl ? { url: imageUrl } : null, // Save the S3 URL if an image was uploaded
    });

    // Save the new personal details to the database
    await newPersonalDetails.save();

    // Respond with the saved personal details
    res.status(201).json(newPersonalDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding personal details' });
  }
};

// Edit personal details by ID
export const editPersonalDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const { name, email, phone } = req.body;
    const file = req.file;

    // Find the personal details document by ID
    const personalDetails = await PersonalDetails.findById(id);

    if (!personalDetails) {
      return res.status(404).json({ message: 'Personal details not found.' });
    }

    // Update fields
    if (name) personalDetails.name = name;
    if (email) personalDetails.email = email;
    if (phone) personalDetails.phone = phone;

    // If a new file is uploaded, upload it to S3 and update the image field
    if (file) {
      // Upload the new file to S3 and get the URL
      const s3Url = await uploadToS3(file, file.originalname);
      
      // Update the image URL in the database (replace the old one)
      personalDetails.image = { url: s3Url };
    }

    // Save the updated personal details to the database
    await personalDetails.save();

    res.status(200).json({ message: 'Personal details updated successfully.', data: personalDetails });
  } catch (error) {
    console.error('Error updating personal details:', error.message);
    res.status(500).json({ message: 'Error updating personal details.', error: error.message });
  }
};
// Get personal details by ID

export const getPersonalDetails = async (req, res) => {
  try {
    // Ensure the user is authenticated by checking if the token is present
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated.',
      });
    }

    const userId = req.user.id; // Extract userId from the token

    // Find the personal details for the user in the database
    const personalDetails = await PersonalDetails.findOne({ userId });

    if (!personalDetails) {
      return res.status(404).json({
        success: false,
        message: 'Personal details not found for this user.',
      });
    }

    // Return the personal details in the response
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

// Delete personal details by ID
export const deletePersonalDetailsById = async (req, res) => {
  try {
    // Ensure the user is authenticated by checking if the token is present
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated.',
      });
    }

    const userId = req.user.id; // Extract userId from the token
    const { id } = req.params; // Extract the personal details ID from the URL parameters

    // Find the personal details by ID
    const personalDetails = await PersonalDetails.findById(id);

    if (!personalDetails) {
      return res.status(404).json({
        success: false,
        message: 'Personal details not found.',
      });
    }

    // Check if the personal details belong to the authenticated user
    if (personalDetails.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete these personal details.',
      });
    }

    // Delete the personal details
    await PersonalDetails.findByIdAndDelete(id);

    // Return success response
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
