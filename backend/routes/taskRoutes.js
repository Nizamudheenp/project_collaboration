const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { createTask, projectTasks, updateTaskStatus, deleteTask } = require('../controllers/taskController');
const router = express.Router();

router.post('/', authMiddleware, createTask);
router.get('/project/:projectId', authMiddleware, projectTasks);
router.put('/:taskId/status', authMiddleware, updateTaskStatus);
router.delete('/:taskId', authMiddleware, deleteTask);

module.exports = router;
