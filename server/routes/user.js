const express = require('express');
const userController = require('../controllers/user');
const { verify, verifyAdmin, isLoggedIn } = require('../auth');

const router = express.Router();

// register route
router.post("/register", userController.registerUser);

// login route
router.post("/login", userController.loginUser);

// user details route
router.get("/details", verify, userController.userRetrieveDetails);


module.exports = router;