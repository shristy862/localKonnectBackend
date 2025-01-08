import User from '../../../../userModal/Modal/modal.js';

export const getCareerObjective = async (req, res) => {
    const candidateId = req.params.id;

    try {
        const candidateUser = await User.findOne(
            { _id: candidateId, userType: 'candidate' },
            { careerObjective: 1 } 
        );

        if (!candidateUser) {
            return res.status(404).json({ message: 'Candidate user not found' });
        }

        res.status(200).json({
            message: 'Career objective retrieved successfully!',
            careerObjective: candidateUser.careerObjective || 'No career objective set.',
        });
    } catch (error) {
        console.error('Error retrieving career objective:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
