import User from '../../../../userModal/Modal/modal.js'; 

export const addWorkExperience = async (req, res) => {
    const { candidateId } = req.params; 
    const { designation, profile, organizationName, location, jobType, mode, startDate, endDate } = req.body;

    try {
        // Validate input
        if (!designation || !profile || !organizationName || !location || !jobType || !mode || !startDate || !endDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find the candidate by ID and add the work experience
        const updatedCandidate = await User.findByIdAndUpdate(
            candidateId,
            {
                $push: {
                    workExperience: { 
                        designation,
                        profile,
                        organizationName,
                        location,
                        jobType,
                        mode,
                        startDate,
                        endDate
                    }
                }
            },
            { new: true } 
        );

        if (!updatedCandidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        res.status(200).json({
            message: 'Work experience added successfully!',
            workExperience: updatedCandidate.workExperience,
        });

    } catch (error) {
        console.error('Error adding work experience:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
