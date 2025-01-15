import Employee from '../../models/serviceProviderEmployee/modal.js'; 
import { sendEmail } from '../../utils/emailservice.js';

export const addEmployee = async (req, res) => {
    const { name, phone, email } = req.body;
  
    if (!name || !phone || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      // Extract the first word from the name
      const firstName = name.split(' ')[0];
  
      // Generate password using the first name
      const password = `${firstName}${phone.slice(-2)}@localKonnect`;
  
      // Save employee to the database
      const newEmployee = new Employee({
        name,
        phone,
        email,
        password, // Store hashed password in real applications
        serviceProvider: req.user.id, // Assuming `req.user` contains the authenticated service provider
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