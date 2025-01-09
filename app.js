import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/usersRoutes.js';
import connectDB from './config/connectDB.js';
import adminRoutes from './superAdmin/Routes/adminRoutes.js';
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('Hello, Elastic Beanstalk!');
});

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

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