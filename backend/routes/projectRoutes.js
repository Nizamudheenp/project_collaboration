const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { createProject, teamProjects, deleteProject } = require('../controllers/projectController');
const router = express.Router();

router.post('/', authMiddleware, createProject);
router.get('/team/:teamId', authMiddleware, teamProjects);
router.delete('/:projectId', authMiddleware, deleteProject);

module.exports = router;