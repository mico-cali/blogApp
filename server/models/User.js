const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Username is Required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is Required'], 
    unique: true 
  },
  password: { 
    type: String, 
    required: [true, 'Password is Required'] 
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  }
});

module.exports = mongoose.model('User', userSchema);