import mongoose from 'mongoose';
const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: 'pending' }, 
    serviceProvider: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User ID who added the employee
  },
  { timestamps: true, collection: 'serviceprovideremployee' } // Specify collection name
);

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
