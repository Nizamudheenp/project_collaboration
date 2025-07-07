const TeamDB = require('../models/teamModel');
const UserDB = require('../models/userModel');
const InvitationDB = require('../models/inviteModel');
const { sendInvitationEmail } = require('../utils/sendEmail');


exports.inviteMember = async (req, res) => {
  const { email } = req.body;
  const { teamId } = req.params;

  try {
    const team = await TeamDB.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const isAdmin = team.members.some(
      (member) => member.userId.toString() === req.user._id.toString() && member.role === 'admin'
    );
    if (!isAdmin) return res.status(403).json({ message: 'Only admins can invite' });

    const existingUser = await UserDB.findOne({ email });
    const alreadyInTeam = team.members.some(
      (member) => member.userId.toString() === existingUser?._id?.toString()
    );
    if (alreadyInTeam) return res.status(400).json({ message: 'User already in team' });

    const existingInvite = await InvitationDB.findOne({ email, teamId, status: 'pending' });
    if (existingInvite) return res.status(400).json({ message: 'Invitation already sent' });

    const newInvite = await InvitationDB.create({
      teamId,
      invitedBy: req.user._id,
      invitedUser: existingUser?._id || null,
      email,
    });

    await sendInvitationEmail({
      to: email,
      invitedBy: req.user.name,
      teamName: team.teamName,
      inviteId: newInvite._id
    });


    res.status(200).json({ message: 'Invitation and email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.respondToInvite = async (req, res) => {
  const { invitationId } = req.params;
  const { action } = req.body;
  const userId = req.user._id;

  try {
    const invite = await InvitationDB.findById(invitationId);
    if (!invite) return res.status(410).json({ message: 'Invitation expired or not found' }); 

    if (invite.status !== 'pending')
      return res.status(400).json({ message: 'Invitation already responded to' });

    if (invite.email !== req.user.email) return res.status(403).json({ message: 'Not authorized' });

    invite.status = action === 'accept' ? 'accepted' : 'rejected';
    await invite.save();

    if (action === 'accept') {
      const team = await TeamDB.findById(invite.teamId);
      team.members.push({ userId, role: 'member' });
      await team.save();
    }

    res.status(200).json({ message: `Invitation ${action}ed` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserInvitations = async (req, res) => {

  try {
    const invites = await InvitationDB.find({
      email: req.user.email,
      status: 'pending'
    })
      .populate('teamId', 'teamName')
      .populate('invitedBy', 'name');
    res.status(200).json(invites); 
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch invitations' });
  }
};
