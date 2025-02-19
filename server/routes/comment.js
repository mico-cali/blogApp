const express = require('express');
const commentController = require('../controllers/comment');
const { verify, verifyAdmin } = require('../auth');

const router = express.Router();

// create comment
router.post('/', verify, commentController.createComment);

// get comments for a specific blog post
router.get('/blog/:blogId', commentController.getCommentsByBlogId);

// get specific comment by ID
router.get('/:id', commentController.getCommentById);

// update a comment
router.put('/:id', verify, commentController.updateComment);

// delete a comment
router.delete('/:id', verify, verifyAdmin, commentController.deleteComment);


module.exports = router;
