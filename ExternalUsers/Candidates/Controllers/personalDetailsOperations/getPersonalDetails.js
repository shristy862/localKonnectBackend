import User from '../../../../userModal/Modal/modal.js';

export const getPersonalDetails = async (req, res) => {
    const candidateId = req.params.id;

    try {
        const candidateUser = await User.findOne({ _id: candidateId, userType: 'candidate' });

        if (!candidateUser) {
            console.error('Candidate user not found');
            return res.status(404).json({ message: 'Candidate user not found' });
        }

        if (!candidateUser.personalDetails) {
            console.error('Personal details not found for candidate');
            return res.status(404).json({ message: 'Personal details not found' });
        }

        console.log('Retrieved personal details:', candidateUser.personalDetails);

        res.status(200).json({
            message: 'Personal details retrieved successfully',
            personalDetails: candidateUser.personalDetails
        });
    } catch (error) {
        console.error('Error retrieving personal details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
