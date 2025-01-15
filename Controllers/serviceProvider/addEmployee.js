import Employee from '../../models/serviceProviderEmployee/modal.js'; 
import { sendEmail } from '../../utils/emailservice.js';

export const addEmployee = async (req, res) => {
  const { name, phone, email } = req.body;

  // Validate required fields
  if (!name || !phone || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Extract the first word from the name
    const firstName = name.split(' ')[0];

    // Generate password using the first name
    const password = `${firstName}${phone.slice(-2)}@localKonnect`;

    // Save employee to the database with 'pending' status and addedBy field
    const newEmployee = new Employee({
      name,
      phone,
      email,
      password, // Store hashed password in real applications
      status: 'pending', // Set status to 'pending'
      serviceProvider: req.user.id, // Service provider ID
      addedBy: req.user.id, // Added by user ID from token
    });

    await newEmployee.save();

    // Send credentials via email
    const subject = 'Your Employee Account Credentials';
    const message = `
      Dear ${firstName},
      
      Your employee account has been created. Here are your login credentials:
      
      Email: ${email}
      Password: ${password}
      
      Please keep this information secure.
      
      Regards,
      LocalKonnect Team
    `;

    await sendEmail(email, subject, message);

    res.status(201).json({ message: 'Employee added and credentials sent via email' });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Failed to add employee' });
  }
};
