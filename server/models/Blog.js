const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
	title: { 
		type: String, 
		required: [true, 'Title is Required'] 
	},
	content: { 
		type: String, 
		required: [true, 'Content is Required'] 
	},
	author: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User', 
		required: [true, 'Author is Required'] 
	},
	createdAt: { 
		type: Date, 
		default: Date.now 
	}
});

module.exports = mongoose.model('Blog', blogSchema);