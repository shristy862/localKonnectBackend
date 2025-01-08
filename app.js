dotenv.config();
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';

// ExternalUsersRoutes
import userRoutes from './routes/usersRoutes.js';
import candidateRoutes from './ExternalUsers/Candidates/Routes/candidateRoute.js';
import companyRoutes from './ExternalUsers/CompanyHr/Routes/companyRoute.js';
import hiringManagerRoutes from './ExternalUsers/Hiring Manager/Routes/hiringMgrRoutes.js';
// Internal Users Routes
import adminRoutes from './InternalUsers/SuperAdmin/Routes/administrationRoutes.js';
import platformHRRoutes from './InternalUsers/PlatformSuperHR/Routes/platformSuperhrRoutes.js';
import platformJrHRRoutes from './InternalUsers/PlatformJrHr/Routes/platformjrRoutes.js';

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('Hello, Elastic Beanstalk!');
});

app.use('/api', userRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/hiring-managers', hiringManagerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/platform-super-hr', platformHRRoutes);
app.use('/api/admin/platformJrHr', platformJrHRRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => console.log(`Server listening at =>  http://localhost:${PORT}`));