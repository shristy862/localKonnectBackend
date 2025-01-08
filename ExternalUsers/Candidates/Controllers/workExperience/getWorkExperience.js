import User from '../../../../userModal/Modal/modal.js'; 

export const getWorkExperience = async (req, res) => {
  try {
    const candidateId = req.params.candidateId;  

    const user = await User.findById(candidateId); 

    if (!user) {
      return res.status(404).json({ message: 'No user found with this candidateId' });
    }

    const workExperience = user.workExperience;

    if (!workExperience || workExperience.length === 0) {
      return res.status(404).json({ message: 'No work experience found for this candidate' });
    }

    res.status(200).json(workExperience);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching work experience data' });
  }
};
