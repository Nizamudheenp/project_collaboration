const TaskDB = require('../models/taskModel');
const ProjectDB = require('../models/projectModel');
const TeamDB = require('../models/teamModel');

exports.createTask = async (req, res) => {
  const { title, description, projectId, assignedTo, dueDate } = req.body;

  if (!title || !description || !projectId || !assignedTo || !dueDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const project = await ProjectDB.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const team = await TeamDB.findById(project.teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const isAdmin = team.members.find(
      (member) => member.userId.toString() === req.user._id.toString() && member.role === 'admin'
    );
    if (!isAdmin) return res.status(403).json({ message: 'Only admin can create tasks' });

    const task = await TaskDB.create({
      title,
      description,
      assignedTo,
      dueDate,
      projectId,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.projectTasks = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await ProjectDB.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const team = await TeamDB.findById(project.teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const isMember = team.members.find(
      (member) => member.userId.toString() === req.user._id.toString()
    );
    if (!isMember) return res.status(403).json({ message: 'You are not a team member' });

    const tasks = await TaskDB.find({ projectId }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['todo', 'inprogress', 'done'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const task = await TaskDB.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await ProjectDB.findById(task.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const team = await TeamDB.findById(project.teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const isAdmin = team.members.find(
      (member) => member.userId.toString() === req.user._id.toString() && member.role === 'admin'
    );

    const isAssignedUser = task.assignedTo?.toString() === req.user._id.toString();

    if (!isAdmin && !isAssignedUser) {
      return res.status(403).json({ message: 'Task updation only for admin and assigned user' });
    }

    task.status = status;
    await task.save();

    res.status(200).json({ message: 'Task status updated', task });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await TaskDB.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await ProjectDB.findById(task.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const team = await TeamDB.findById(project.teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const isAdmin = team.members.find(
      (member) => member.userId.toString() === req.user._id.toString() && member.role === 'admin'
    );

    if (!isAdmin) return res.status(403).json({ message: 'Only team admins can delete tasks' });

    await TaskDB.findByIdAndDelete(taskId);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};




