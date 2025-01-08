import User from '../../../../userModal/Modal/modal.js';

export const addEducationalDetails = async (req, res) => {
    const candidateId = req.params.id;
    const { type, degree, institution, passingYear, grade, fieldOfStudy } = req.body;

    try {
        // Find the candidate
        const candidateUser = await User.findOne({ _id: candidateId, userType: 'candidate' });

        if (!candidateUser) {
            return res.status(404).json({ message: 'Candidate user not found' });
        }

        // Validate input
        if (!type || !degree || !institution || !passingYear || !grade ||!fieldOfStudy ) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Add new educational detail
        const newEducation = {
            type,
            degree,
            institution,
            passingYear,
            grade,
            fieldOfStudy,
        };

        // Ensure `educationalDetails` array exists
        if (!candidateUser.educationalDetails) {
            candidateUser.educationalDetails = [];
        }

        candidateUser.educationalDetails.push(newEducation);

        // Save updated user
        await candidateUser.save();

        res.status(200).json({
            message: 'Educational details updated successfully!',
            educationalDetails: candidateUser.educationalDetails,
        });
    } catch (error) {
        console.error('Error updating educational details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
