const CommentDB = require('../models//commentModel');
const TaskDB = require('../models/taskModel');
const ProjectDB = require('../models/projectModel');
const TeamDB = require('../models/teamModel');

exports.addComment = async (req, res) => {
    const { taskId, text } = req.body;

    if (!taskId || !text) {
        return res.status(400).json({ message: 'taskId and text are required' });
    }

    try {
        const task = await TaskDB.findById(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const project = await ProjectDB.findById(task.projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const team = await TeamDB.findById(project.teamId);
        if (!team) return res.status(404).json({ message: 'Team not found' });

        const isMember = team.members.find(
            (member) => member.userId.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({ message: 'You are not authorized to comment on this task' });
        }

        const comment = await CommentDB.create({
            taskId,
            userId: req.user._id,
            text,
        });

        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.CommentsByTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const comments = await CommentDB.find({ taskId })
            .populate('userId', 'name email')
            .sort({ createdAt: 1 });

        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
