const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { createTeam, myTeams, removeMember, deleteTeam, teamById } = require('../controllers/teamController');
const router = express.Router();

router.post('/', authMiddleware,  createTeam);     
router.get('/', authMiddleware,  myTeams);  
router.get('/:teamId', authMiddleware, teamById);
router.delete('/:teamId/remove/:userId', authMiddleware, removeMember);
router.delete('/:teamId', authMiddleware, deleteTeam);


module.exports = router;
