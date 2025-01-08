import User from '../../../userModal/Modal/modal.js';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../../../Services/emailService.js'; 

export const addHiringManager = async (req, res) => {
    const { name, email, phone ,userType} = req.body; 
    
    const companyId = req.params.companyId; 
    try {
        const randomDigits = Math.floor(1000 + Math.random() * 9000);

        const generatedEmail = `${name.toLowerCase()}_${randomDigits}@company.com`;

        const generatedPassword = `Pass@${randomDigits}${Math.floor(1000 + Math.random() * 9000)}`;

        const hashedPassword = await bcrypt.hash(generatedPassword, 10);
        // Create a new hiring manager 
        const newUser = new User({ 
            email: generatedEmail,
            password: hashedPassword,
            userType :userType, 
            defaultEmail: email,             
            name,                        
            phone,                       
            companyId ,
            isVerified: true,   
        });
        await newUser.save();

        // Send the generated email and password to user's given emai
        const subject = 'Your Account Credentials';
        const message = `Hello ${name},\n\nYour account has been created!\n\nHere are your credentials:\nEmail: ${generatedEmail}\nPassword: ${generatedPassword}\n\nPlease keep this information secure.`;

        await sendEmail(email, subject, message);

        res.status(201).json({ 
            message: 'Hiring Manager created successfully and credentials sent via email', 
            hiringManager: {
                name,
                generatedEmail,
                phone,
                generatedPassword 
            } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
