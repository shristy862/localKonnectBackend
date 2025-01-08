import User from '../../../userModal/Modal/modal.js';
import Job from '../Modal/jobModal.js';

export const postJob = async (req, res) => {
    
    const { title, description, location, requirements } = req.body;
    const hiringManagerId = req.params.id; 
    try {
        // Verify the user is a hiring manager
        const user = await User.findById(hiringManagerId);
        
        if (!user || user.userType !== 'HiringManager') {
            return res.status(403).json({ message: 'Unauthorized access. Only Hiring Managers can post jobs.' });
        }

        // Create a new job 
        const job = new Job({
            title,
            description,
            location,
            requirements,
            postedBy: hiringManagerId,
        });

        // Save 
        await job.save();
        
        res.status(201).json({
            message: 'Job posted successfully',
            job: {
                title: job.title,
                description: job.description,
                location: job.location,
                requirements: job.requirements,
                postedBy: job.postedBy, 
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};