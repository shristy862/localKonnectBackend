import User from '../../../../userModal/Modal/modal.js'; 

export const updateWorkExperience = async (req, res) => {
    const candidateId = req.params.candidateId; 
    const { organizationName, ...updatedFields } = req.body; 

    try {
        const candidateUser = await User.findOne({ _id: candidateId, userType: 'candidate' });

        if (!candidateUser) {
            return res.status(404).json({ message: 'Candidate user not found' });
        }

        // Ensure the workExperience array exists
        if (!candidateUser.workExperience || candidateUser.workExperience.length === 0) {
            return res.status(404).json({ message: 'No work experience found for the candidate.' });
        }

        // Find the work experience by organization name
        const workExperience = candidateUser.workExperience.find(
            (workExp) => workExp.organizationName === organizationName
        );

        if (!workExperience) {
            return res.status(404).json({ message: `No work experience found for organization: ${organizationName}` });
        }

        // Update only the fields provided in the request
        Object.keys(updatedFields).forEach((field) => {
            if (updatedFields[field] !== undefined) {
                if (field === 'startDate' || field === 'endDate') {
                    // Ensure valid date format
                    const date = new Date(updatedFields[field]);
                    if (isNaN(date)) {
                        return res.status(400).json({ message: `Invalid date format for ${field}` });
                    }
                    workExperience[field] = date;
                } else {
                    workExperience[field] = updatedFields[field];
                }
            }
        });

        await candidateUser.save();

        res.status(200).json({
            message: 'Work experience updated successfully!',
            updatedWorkExperience: workExperience,
        });
    } catch (error) {
        console.error('Error updating work experience:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
