const Blog = require('../models/Blog')
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
	.then(result => {
		if(result.length > 0) {
			return res.status(200).send(result)
		} else {
			return res.status(404).send({ error: 'No blogs found' })
		}
	})
	.catch(error => errorHandler(error, req, res))
}


// get post by id
module.exports.getPostById = (req, res) => {
	Blog.findById(req.params.id)
	.then(result => {
		if(result) {
			return res.status(200).send(result)
		} else {
			return res.status(404).send({ error: 'No blogs found' })
		}
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
