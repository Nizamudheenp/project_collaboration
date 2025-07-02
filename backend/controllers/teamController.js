const TeamDB = require('../models/teamModel');
const UserDB = require('../models/userModel');

exports.createTeam = async (req, res) => {
  const { teamName } = req.body;

  if (!teamName) return res.status(400).json({ message: 'Team name is required' });

  try {
    const team = await TeamDB.create({
      teamName,
      createdBy: req.user._id,
      members: [{ userId: req.user._id, role: 'admin' }],
    });

    await UserDB.findByIdAndUpdate(req.user._id, {
      $push: {  teams: { teamId: team._id, role: 'admin' }  },
    });

    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.myTeams = async (req, res) => {
  try {
    const teams = await TeamDB.find({ 'members.userId': req.user._id });
    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.inviteMember = async (req, res) => {
  const { email } = req.body;
  const { teamId } = req.params;

  try {
    const team = await TeamDB.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const isAdmin = team.members.find(
      (member) => member.userId.toString() === req.user._id.toString() && member.role === 'admin'
    );
    if (!isAdmin) return res.status(403).json({ message: 'Only team admins can invite' });

    const inviteUser = await UserDB.findOne({ email });
    if (!inviteUser) return res.status(404).json({ message: 'User not found' });

    const existing = team.members.find(
      (member) => member.userId.toString() === inviteUser._id.toString()
    );
    if (existing) return res.status(400).json({ message: 'User already in team' });

    team.members.push({ userId: inviteUser._id, role: 'member' });
    await team.save();

    res.status(200).json({ message: 'User invited successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeMember = async (req, res) => {
  const { teamId, userId } = req.params;

  try {
    const team = await TeamDB.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const isAdmin = team.members.find(
      (member) => member.userId.toString() === req.user._id.toString() && member.role === 'admin'
    );
    if (!isAdmin) return res.status(403).json({ message: 'Only admins can remove members' });

    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: "You can't remove yourself" });
    }

    const isMember = team.members.find(
      (member) => member.userId.toString() === userId
    );
    if (!isMember) return res.status(404).json({ message: 'User not in team' });

    team.members = team.members.filter(
      (member) => member.userId.toString() !== userId
    );

    await team.save();

    res.status(200).json({ message: 'Member removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTeam = async (req, res) => {
  const { teamId } = req.params;
  
  try {
    const team = await TeamDB.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const isAdmin = team.members.find(
      (member) => member.userId.toString() === req.user_id.toString() && member.role === 'admin'
    );
    if (!isAdmin) return res.status(403).json({ message: "Only admins can delete team" });

    await TeamDB.findByIdAndDelete(teamId);
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

