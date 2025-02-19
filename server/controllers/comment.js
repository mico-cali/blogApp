const Comment = require('../models/Comment');
const Blog = require('../models/Blog')


// create comment
module.exports.createComment = (req, res) => {

	Blog.findById(req.body.blog) 
	.then(existingBlog => {
		if(!existingBlog) {
	 		return res.status(404).json({ message: 'Blog post not found' });
		}

		const newComment = new Comment({
			content: req.body.content,
			author: req.user.id,
			blog: req.body.blog
		})
		return newComment.save(); // Return the promise from save()
    })
    .then(savedComment => {
        return Comment.findById(savedComment.id).populate('author', 'username');
    })
    .then(populatedComment => {
        res.status(201).json({ 
        	message: 'Comment created', 
        	comment: populatedComment 
        });
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    });
}


// get comment for specific post
module.exports.getCommentsByBlogId = (req, res) => {
    Comment.find({ blog: req.params.blogId }).populate('author', 'username')
        .then(comments => {
            res.status(200).json({ comments });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        });
};


// get specific comment
module.exports.getCommentById = (req, res) => {
    Comment.findById(req.params.id).populate('author', 'username')
        .then(comment => {
            if (!comment) return res.status(404).json({ message: 'Comment not found' });
            res.status(200).json({ comment });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        });
};


// Update a comment
// module.exports.updateComment = (req, res) => {
//     const { content } = req.body;

//     if (!content) {
//         return res.status(400).json({ message: 'Content is required for update' });
//     }

//     Comment.findById(req.params.id)
//         .then(comment => {
//             if (!comment) {
//                 return res.status(404).json({ message: 'Comment not found' });
//             }

//             // check authorization wherein the author or admin can update it
//             if (comment.author.toString() !== req.user.id.toString() && !req.user.isAdmin) {
//                 return res.status(403).json({ message: 'Unauthorized' });
//             }

//             comment.content = content;
//             return comment.save();
//         })
//         .then(updatedComment => {
//             return Comment.findById(updatedComment._id).populate('author', 'username');
//         })
//         .then(populatedComment => {
//             res.status(200).json({ 
//             	message: 'Comment updated', 
//             	comment: populatedComment 
//             });
//         })
//         .catch(error => {
//             console.error(error);
//             res.status(500).json({ message: 'Server error' });
//         });
// };

module.exports.updateComment = (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ message: 'Content is required for update' });
    }

    Comment.findById(req.params.id)
        .then(comment => {
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            
            console.log("User ID:", req.user.id, "Comment Author ID:", comment.author.toString());

            if (comment.author.toString() !== req.user.id.toString() && !req.user.isAdmin) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            comment.content = content;
            return comment.save();
        })
        .then(updatedComment => {
            return Comment.findById(updatedComment._id).populate('author', 'username');
        })
        .then(populatedComment => {
            console.log("Updated Comment:", populatedComment);
            res.status(200).json({ message: 'Comment updated', comment: populatedComment });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        });
};



// delete a comment
module.exports.deleteComment = (req, res) => {
    Comment.findById(req.params.id)
        .then(comment => {
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            // check authorization wherein the author or admin can delete it
            if (comment.author.toString() !== req.user.id.toString() && !req.user.isAdmin) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            return comment.deleteOne();
        })
        .then(() => {
            res.status(200).json({ message: 'Comment deleted' });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        });
};

