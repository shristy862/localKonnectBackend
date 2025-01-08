import bcrypt from 'bcryptjs';
import User from '../../../../EasyjobBackend/userModal/Modal/modal.js';
import { sendEmail } from '../../../../EasyjobBackend/Services/emailService.js';

export const createSuperAdmin = async (req, res) => {
  const { name, password, recipientEmail } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new SuperAdmin 
    const superAdminUser = new User({
      email: recipientEmail,
      password: hashedPassword,
      userType: 'superadmin',
      isVerified: true,
    });

    await superAdminUser.save();

    const subject = 'Your SuperAdmin Account Credentials';
    const message = `
      Hello ${name},

      Your SuperAdmin account has been created with the following credentials:

      Email: ${recipientEmail}
      Password: ${password}

      Please log in and change your password upon first access.

      Best regards,
      Your Company
    `;

    // Send the credentials 
    await sendEmail(recipientEmail, subject, message);

    res.status(201).json({ message: 'SuperAdmin created, credentials sent via email',
       email: recipientEmail ,
       id: superAdminUser._id  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
