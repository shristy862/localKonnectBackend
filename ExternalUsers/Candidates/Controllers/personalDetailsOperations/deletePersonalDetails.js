import mongoose from 'mongoose';
import User from '../../../../userModal/Modal/modal.js';

export const deletePersonalDetails = async (req, res) => {
    const candidateId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
        return res.status(400).json({ message: 'Invalid candidate ID' });
    }

    try {
        const candidateUser = await User.findOne({ _id: candidateId, userType: 'candidate' });
        if (!candidateUser) {
            console.error('Candidate user not found');
            return res.status(404).json({ message: 'Candidate user not found' });
        }

        candidateUser.personalDetails = null;
        await candidateUser.save();

        res.status(200).json({ message: 'Personal details deleted successfully!' });
        console.log('personal details deleted successfully');
    } catch (error) {
        console.error('Error deleting personal details:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
