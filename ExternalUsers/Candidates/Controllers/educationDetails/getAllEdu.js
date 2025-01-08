import User from '../../../../userModal/Modal/modal.js';

export const getEducationalDetails = async (req, res) => {
    const candidateId = req.params.id;

    try {
        const candidateUser = await User.findOne(
            { _id: candidateId, userType: 'candidate' },
            { educationalDetails: 1 } 
        );

        if (!candidateUser) {
            return res.status(404).json({ message: 'Candidate user not found' });
        }

        res.status(200).json({
            message: 'Educational details fetched successfully!',
            educationalDetails: candidateUser.educationalDetails || [],
        });
    } catch (error) {
        console.error('Error fetching educational details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
