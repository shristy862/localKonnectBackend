import User from '../../../../userModal/Modal/modal.js'; 

export const deleteWorkExperience = async (req, res) => {
    const candidateId = req.params.candidateId; 
    const { organizationName } = req.body; 

    try {

        const candidateUser = await User.findOne({ _id: candidateId, userType: 'candidate' });

        if (!candidateUser) {
            return res.status(404).json({ message: 'Candidate user not found' });
        }

        // Ensure the workExperience array exists and is not empty
        if (!candidateUser.workExperience || candidateUser.workExperience.length === 0) {
            return res.status(404).json({ message: 'No work experience found for the candidate.' });
        }

        // Find the index of the work experience by organization name
        const workExperienceIndex = candidateUser.workExperience.findIndex(
            (workExp) => workExp.organizationName === organizationName
        );

        if (workExperienceIndex === -1) {
            return res.status(404).json({ message: `No work experience found for organization: ${organizationName}` });
        }

        candidateUser.workExperience.splice(workExperienceIndex, 1);

        await candidateUser.save();

        res.status(200).json({
            message: `Work experience for ${organizationName} removed successfully!`,
        });
    } catch (error) {
        console.error('Error deleting work experience:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
