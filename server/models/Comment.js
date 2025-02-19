const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	content: { 
		type: String, 
		required: [true, 'Comment Content is Required'] 
	},
	author: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User', 
		required: [true, 'Comment Author is Required'] 
	},
	blog: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Blog',
		required: [true, 'Blog Post is Required'] 
	},
	createdAt: { 
		type: Date, 
		default: Date.now 
	}
});

module.exports = mongoose.model('Comment', commentSchema);