dotenv.config();
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/connectDB.js';
import authRoutes from './Routes/auth/authRoutes.js';
import userRoutes from './Routes/user/userRoutes.js';
import pictureRoutes from './Routes/serviceproviderProfile/profilePicRoutes.js';
import personalDetails from './Routes/serviceproviderProfile/personalDetails.js';
import services from './Routes/serviceproviderProfile/serviceRoutes.js';
const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('Hello, Welcome to Local Knonnect App!');
});

app.use('/api/users/auth', authRoutes);

app.use('/api/auth', userRoutes);

app.use('/api/auth/serviceprovider/profile/' , pictureRoutes);

app.use('/api/auth/serviceprovider/personaldetails', personalDetails);

app.use('/api/auth/serviceprovider/services' , services);

// 404 Error Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => console.log(`Server listening at =>  http://localhost:${PORT}`));