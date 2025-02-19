const express = require('express');
const blogController = require('../controllers/blog');
const { verify, verifyAdmin } = require('../auth');

const router = express.Router();

// create new blog post
router.post("/posts", verify, blogController.createPost);

// get all blog posts
router.get("/posts", blogController.getAllPosts);

// get a specific blog post
router.get("/posts/:id", blogController.getPostById);

// update blog post
router.put("/posts/:id", verify, blogController.updatePost);

// delete blog Post
router.delete("/posts/:id", verify, blogController.deletePost); 

module.exports = router;