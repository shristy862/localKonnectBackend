import User from '../../../../userModal/Modal/modal.js';

export const updateCareerObjective = async (req, res) => {
    const candidateId = req.params.id; 
    const { careerObjective } = req.body; 

    try {
        // Validate input
        if (!careerObjective || careerObjective.trim() === '') {
            return res.status(400).json({ message: 'Career objective is required' });
        }

        // Find and update the candidate's career objective
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
            candidate: candidateUser,
        });
    } catch (error) {
        console.error('Error updating career objective:', error);
        res.status(500).json({ message: 'Server error' });
    }
};