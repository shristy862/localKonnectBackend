import User from '../../../../userModal/Modal/modal.js';

export const updatePersonalDetails = async (req, res) => {
    const candidateId = req.params.id;
    const { firstName, lastName, phoneNo, links, city, gender, languages } = req.body;

    try {
        const candidateUser = await User.findOne({ _id: candidateId, userType: 'candidate' });

        if (!candidateUser) {
            return res.status(404).json({ message: 'Candidate user not found' });
        }

        if (!candidateUser.personalDetails) {
            candidateUser.personalDetails = {};
        }

        // Extract uploaded file URLs
        const cvUrl = req.files?.cv?.[0]?.location || null; 
        const photoUrl = req.files?.photo?.[0]?.location || null; 

        // Update only the fields that are provided
        if (firstName) candidateUser.personalDetails.firstName = firstName;
        if (lastName) candidateUser.personalDetails.lastName = lastName;
        if (phoneNo) candidateUser.personalDetails.phoneNo = phoneNo;
        if (links) candidateUser.personalDetails.links = links.split(',').map((link) => link.trim()); // Handle comma-separated links
        if (city) candidateUser.personalDetails.city = city;
        if (gender) candidateUser.personalDetails.gender = gender;
        if (languages) candidateUser.personalDetails.languages = languages;
        if (cvUrl) candidateUser.personalDetails.cv = cvUrl;
        if (photoUrl) candidateUser.personalDetails.photo = photoUrl;

        await candidateUser.save();

        res.status(200).json({
            message: 'Personal details updated successfully!',
            personalDetails: candidateUser.personalDetails,
        });
    } catch (error) {
        console.error('Error updating personal details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
