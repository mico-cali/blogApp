const bcrypt = require('bcrypt');
const User = require('../models/User');
const auth = require('../auth');

// register user
module.exports.registerUser = (req, res) => {

	// Checks email format
	if(!req.body.email.includes("@")) {
		return res.status(400).send({ error: "Email invalid" })
	} 
	// Checks pasword has atleast 8 char
	else if(req.body.password.length < 8) {
		return res.status(400).send({ error: "Password must be atleast 8 characters" })
	} else {
		let newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 10)
		})

		return newUser.save()
		.then((result) => res.status(201).send({ message: "Registered Successfully" }))
		.catch(error => auth.errorHandler(error, req, res));
	}
};


// login user
module.exports.loginUser = (req, res) => {
	
	// Checks email format
	if(req.body.email.includes("@")) {
		
		return User.findOne({email: req.body.email})
		.then(result => {
			if(result == null) {
				return res.status(404).send({ error: "No Email Found" })
			} else {
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

				if(isPasswordCorrect) {
					return res.status(200).send({ access: auth.createAccessToken(result) });
				} else {
					return res.status(401).send({ error: "Email and password do not match" })
				}
			}
		})
		.catch(error => auth.errorHandler(error, req, res));	
	
	} else {
		return res.status(400).send({ error: "Invalid Email" })
	}
}


// get user details
module.exports.userRetrieveDetails = (req, res) => {

    User.findById(req.user.id)
        .then(user => {
            if (user) {
                user.password = "";
                return res.status(200).send(user);
            } else {
                return res.status(404).send({ message: "User not found." });
            }
        })
        .catch(error => errorHandler(error, req, res));
};

