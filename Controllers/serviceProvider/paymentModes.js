import PaymentMode from '../../models/serviceProvider/paymentModes.js';

// Create a new payment mode
export const createPaymentMode = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if the payment mode already exists
    const existingPaymentMode = await PaymentMode.findOne({ name });
    if (existingPaymentMode) {
      return res.status(400).json({ message: 'Payment mode already exists.' });
    }

    const newPaymentMode = new PaymentMode({ name, description });
    await newPaymentMode.save();

    res.status(201).json({ message: 'Payment mode created successfully.', data: newPaymentMode });
  } catch (error) {
    console.error('Error creating payment mode:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all payment modes
export const getAllPaymentModes = async (req, res) => {
  try {
    const paymentModes = await PaymentMode.find();
    res.status(200).json({ data: paymentModes });
  } catch (error) {
    console.error('Error fetching payment modes:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get payment mode by ID
export const getPaymentModeById = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentMode = await PaymentMode.findById(id);

    if (!paymentMode) {
      return res.status(404).json({ message: 'Payment mode not found.' });
    }

    res.status(200).json({ data: paymentMode });
  } catch (error) {
    console.error('Error fetching payment mode:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update payment mode by ID
export const updatePaymentMode = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const paymentMode = await PaymentMode.findById(id);
    if (!paymentMode) {
      return res.status(404).json({ message: 'Payment mode not found.' });
    }

    // Update fields
    if (name) paymentMode.name = name;
    if (description) paymentMode.description = description;

    await paymentMode.save();
    res.status(200).json({ message: 'Payment mode updated successfully.', data: paymentMode });
  } catch (error) {
    console.error('Error updating payment mode:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete payment mode by ID
export const deletePaymentMode = async (req, res) => {
  try {
    const { id } = req.params;

    const paymentMode = await PaymentMode.findById(id);
    if (!paymentMode) {
      return res.status(404).json({ message: 'Payment mode not found.' });
    }

    await PaymentMode.findByIdAndDelete(id);
    res.status(200).json({ message: 'Payment mode deleted successfully.' });
  } catch (error) {
    console.error('Error deleting payment mode:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
