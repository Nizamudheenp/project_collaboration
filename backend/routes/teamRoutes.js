const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { createTeam, myTeams, inviteMember, removeMember, deleteTeam } = require('../controllers/teamController');
const router = express.Router();

router.post('/', authMiddleware,  createTeam);     
router.get('/', authMiddleware,  myTeams);  
router.post('/:teamId/invite', authMiddleware, inviteMember);    
router.delete('/:teamId/remove/:userId', authMiddleware, removeMember);
router.delete('/:teamId', authMiddleware, deleteTeam);


module.exports = router;
