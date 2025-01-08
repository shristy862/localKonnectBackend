import User from '../../../userModal/Modal/modal.js';  

export const completeCompanyProfile = async (req, res) => {
    const { 
        phoneNo,
        location,
        websiteUrl,
        industryType,
        companySize,
        representative,
        registrationNumber,
        gstNumber
    } = req.body;

    const companyId =  req.params.id; ; 

    try {
        // console.log("Received Request to complete profile with company ID:", companyId);

        // Find the user by companyId
        const companyUser = await User.findById(companyId);

        if (!companyUser || companyUser.userType !== 'company') {
            return res.status(404).json({ message: 'Company user not found' });
        }

        // console.log('Received company profile data:', req.body);

        // Update the company fields 
        companyUser.phoneNo = phoneNo || companyUser.phoneNo;
        companyUser.location = location || companyUser.location;
        companyUser.websiteUrl = websiteUrl || companyUser.websiteUrl;
        companyUser.industryType = industryType || companyUser.industryType;
        companyUser.companySize = companySize || companyUser.companySize;
        companyUser.representative = representative || companyUser.representative;
        companyUser.registrationNumber = registrationNumber || companyUser.registrationNumber;
        companyUser.gstNumber = gstNumber || companyUser.gstNumber;

        // Save the updated user
        await companyUser.save();

        res.status(200).json({ message: 'Company profile updated successfully', companyUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
