import User from '../../../../userModal/Modal/modal.js';

export const deleteCareerObjective = async (req, res) => {
    const candidateId = req.params.id;

    try {
        // Find and update the candidate by ID
        const candidateUser = await User.findOneAndUpdate(
            { _id: candidateId, userType: 'candidate' },
            { $unset: { careerObjective: "" } }, 
            { new: true } 
        );

        if (!candidateUser) {
            return res.status(404).json({ message: 'Candidate user not found' });
        }

        res.status(200).json({
            message: 'Career objective deleted successfully!',
            candidate: candidateUser,
        });
    } catch (error) {
        console.error('Error deleting career objective:', error);
        res.status(500).json({ message: 'Server error' });
    }
};