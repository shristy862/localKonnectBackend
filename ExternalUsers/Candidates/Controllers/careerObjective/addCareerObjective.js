import mongoose from 'mongoose';
import User from '../../../../userModal/Modal/modal.js';

export const addCareerObjective = async (req, res) => {
    const candidateId = req.params.id;

    // Validate the candidateId 
    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
        return res.status(400).json({ message: 'Invalid candidate ID' });
    }

    const { careerObjective } = req.body;

    try {
        // Validate input
        if (!careerObjective || careerObjective.trim() === '') {
            return res.status(400).json({ message: 'Career objective is required' });
        }

        // Find the candidate 
        const candidateUser = await User.findOneAndUpdate(
            { _id: candidateId, userType: 'candidate' },
            { careerObjective },
            { new: true } 
        );

        if (!candidateUser) {
            return res.status(404).json({ message: 'Candidate user not found' });
        }

        res.status(200).json({
            message: 'Career objective updated successfully!',
            careerObjective: candidateUser.careerObjective,
        });
    } catch (error) {
        console.error('Error updating career objective:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
