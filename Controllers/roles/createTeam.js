import Team from '../../models/roles/team.js'; 
import User from '../../models/auth/user.js'; 

export const createTeam = async (req, res) => {
    try {
      // 1. Ensure the user is an Admin
      if (!req.user || req.user.role !== 'Admin') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: Only Admins can create a team.'
        });
      }
  
      // 2. Get admin user information
      const adminUser = req.user;
  
      // Log the adminUser to ensure it is correctly populated
      console.log('Admin user:', adminUser);
  
      // 3. Extract team members from the request body (Array of userIds, names, and phone numbers)
      const { teamName, teamMembers } = req.body; // Assumes data in `req.body`
  
      if (!teamName || !Array.isArray(teamMembers) || teamMembers.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Team name and team members array are required.'
        });
      }
  
      // 4. Validate that each team member exists and fetch their data from the DB
      const membersData = [];
  
      for (let member of teamMembers) {
        const { userId, name, phone } = member;
  
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: `User with ID ${userId} not found.`
          });
        }
  
        // Push the formatted team member data into membersData array
        membersData.push({
          userId,
          name,
          phone,
          email: user.email,
          userType: user.userType,
          designation: user.userType, // Assuming you want to store `userType` as designation
        });
      }
  
      // 5. Create the team object and save it to the database
      const newTeam = new Team({
        teamName,
        teamMembers: membersData,
        createdBy: adminUser.id, // Save the admin who created the team
      });
  
      // Save the team to the database
      await newTeam.save(); 
  
      // 6. Return a success response
      return res.status(201).json({
        success: true,
        message: 'Team created successfully!',
        team: newTeam,
      });
    } catch (error) {
      console.error('Error creating team:', error.message);
      return res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
      });
    }
  };
  