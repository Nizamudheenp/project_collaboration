const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { addComment, CommentsByTask } = require('../controllers/commentController');
const router = express.Router();

router.post('/', authMiddleware, addComment);
router.get('/:taskId', authMiddleware, CommentsByTask);

module.exports = router;