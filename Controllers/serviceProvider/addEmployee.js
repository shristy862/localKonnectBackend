import bcrypt from 'bcryptjs';
import User from '../../models/auth/user.js'; 
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

    // Generate raw password using the first name
    const rawPassword = `${firstName}${phone.slice(-2)}@localKonnect`;

    // Hash the password
    const hashedPassword = await bcrypt.hash(rawPassword, 10); // 10 is the salt rounds

    // Save employee to the User collection
    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword, // Store hashed password
      rawPassword, // Store plain password temporarily
      status: 'pending', // Set status to 'pending'
      userType: 'ServiceProviderEmployee', // Assign role
      serviceProvider: req.user.id, // Service provider ID
      addedBy: req.user.id, // Added by user ID from token
    });

    await newUser.save();

    // Send credentials via email
    const subject = 'Your Employee Account Credentials';
    const message = `
      Dear ${firstName},
      
      Your employee account has been created. Here are your login credentials:
      
      Email: ${email}
      Password: ${rawPassword}
      
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
