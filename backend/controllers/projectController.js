const TeamDB = require('../models/teamModel');
const ProjectDB = require('../models/projectModel');

exports.createProject = async (req, res) => {
    const { projectName, description, teamId } = req.body;

    if (!projectName || !description || !teamId) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const team = await TeamDB.findById(teamId);
        if (!team) return res.status(404).json({ message: 'Team not found' });

        const isAdmin = team.members.find(
            (member) => member.userId.toString() === req.user._id.toString() && member.role === 'admin'
        );
        if (!isAdmin) return res.status(403).json({ message: 'Only admin can create projects' });

        const newProject = await ProjectDB.create({
            projectName,
            description,
            createdBy: req.user._id,
            teamId,
        });

        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.teamProjects = async (req, res) => {
    const { teamId } = req.params;

    try {
        const team = await TeamDB.findById(teamId);
        if (!team) return res.status(404).json({ message: 'Team not found' });

        const isMember = team.members.find(
            (member) => member.userId.toString() === req.user._id.toString()
        );
        if (!isMember) return res.status(403).json({ message: 'You are not a member of this team' });

        const projects = await ProjectDB.find({ teamId });
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await ProjectDB.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const team = await TeamDB.findById(project.teamId);
        if (!team) return res.status(404).json({ message: 'Team not found' });

        const isAdmin = team.members.find(
            (member) => member.userId.toString() === req.user._id.toString() && member.role === 'admin'
        );
        if (!isAdmin) {
            return res.status(403).json({ message: 'You are not an admin to delete this project' });
        }

        await ProjectDB.findByIdAndDelete(projectId);
        res.status(200).json({ message: 'Project deleted successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}