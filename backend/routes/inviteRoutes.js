const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { inviteMember, respondToInvite, getUserInvitations } = require('../controllers/inviteController');
const router = express.Router();

router.post('/:teamId/invite', authMiddleware, inviteMember);  
router.post('/respond/:invitationId', authMiddleware, respondToInvite); 
router.get('/my', authMiddleware, getUserInvitations); 

module.exports = router;
