dotenv.config();
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/connectDB.js';
import authRoutes from './Routes/authRoutes.js';
import userRoutes from './Routes/userRoutes.js';
import profileRoutes from './Routes/profilePicRoutes.js';
import personalDetails from './Routes/personalDetails.js';
import services from './Routes/serviceRoutes.js';
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

app.use('/api/auth/profile' , profileRoutes);

app.use('/api/auth/personal-details', personalDetails);

app.use('/api/auth/services' , services);
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