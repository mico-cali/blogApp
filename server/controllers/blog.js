const Blog = require('../models/Blog')
const Comment = require('../models/Comment');
const { errorHandler } = require("../auth");


// create posts
module.exports.createPost = (req, res) => {

	let newPost = new Blog({
		title: req.body.title,
		content: req.body.content,
		author: req.user.id
	})

	Blog.findOne({name: req.body.title})
	newPost.save()
        .then(result => {
            res.status(201).send({
                title: result.title,
                content: result.content,
                author: result.author,
                createdAt: result.createdAt,
                _id: result._id,
                __v: result.__v
            });
        })
        .catch(error => errorHandler(error, req, res));
}

// get posts
module.exports.getAllPosts = (req, res) => {
	Blog.find({})
    .populate('author', 'username')
	.then(blogs => {
        if (blogs.length > 0) {
    		const postsWithComments = [];

            // Use a loop to process each blog
            let processedBlogs = 0;

            if (blogs.length === 0){
                return res.status(200).send([])
            }

            blogs.forEach(blog => { // Use forEach for iterating
                Comment.find({ blog: blog.id }).populate('author', 'username')
                    .then(comments => {
                        const postWithComments = {
                            ...blog.toObject(),
                            comments: comments
                        };
                        postsWithComments.push(postWithComments);

                        processedBlogs++;

                        // Check if all blogs have been processed
                        if (processedBlogs === blogs.length) {
                            res.status(200).send(postsWithComments);
                        }
                    })
                    .catch(error => {
                        errorHandler(error, req, res);
                    });
            });

        } else {
            return res.status(404).send({ error: 'No blogs found' });
        }
  	})
	.catch(error => errorHandler(error, req, res))
}


// get post by id
module.exports.getPostById = (req, res) => {
	Blog.findById(req.params.id)
    .populate('author', 'username')
    .then(blog => {
        if (!blog) {
            return res.status(404).send({ error: 'No blogs found' });
        }

        Comment.find({ blog: blog._id }).populate('author', 'username')
            .then(comments => {
                const postWithComments = {
                    ...blog.toObject(),
                    comments: comments
                };
                res.status(200).send(postWithComments);
            })
            .catch(commentError => {
                console.error("Error fetching comments:", commentError);
                res.status(500).json({ message: 'Error fetching comments' });
            });
        })
	.catch(error => errorHandler(error, req, res))
} 


// update post
module.exports.updatePost = (req, res) => {

    let updatedPost = {
        title: req.body.title,
		content: req.body.content,
		author: req.user.id
    }

    return Blog.findByIdAndUpdate(req.params.id, updatedPost)
    .then(post => {
        if (post) {
            res.status(200).send({success: true, message: "Post updated successfully"});
        } else {
            res.status(404).send({error: "Post not found"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};


// delete a post 
module.exports.deletePost = (req, res) => {
	Blog.findByIdAndDelete(req.params.id)
	.then(deletedPost  => {
		if(!deletedPost ) {
			return res.status(404).send({ error: 'Post not found' })
		} 

		return res.status(200).send({
			message: 'Post deleted successfully',
			post: deletedPost  
		})
	})
	.catch(error => {
		console.error('Error in deleting post: ', error);
        return res.status(500).send({ error: 'Error in deleting the post' });
	})	
}
