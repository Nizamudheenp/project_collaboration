const ActivityDB = require('../models/activityModel');

exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityDB.find({ taskId: req.params.taskId })
      .populate('userId', 'name')
      .sort({ createdAt: 1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load activity logs' });
  }
};
