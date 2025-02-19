//Dependencies
const jwt = require("jsonwebtoken");
const secret = "blogManagement";

// Token Creation

module.exports.createAccessToken = (user) => {

    const data = {
        id : user._id,
        email : user.email,
        isAdmin : user.isAdmin
    };

    return jwt.sign(data, secret, {});
    
};

// Token Verification

module.exports.verify = (req, res, next) => {
    console.log(req.headers.authorization);

    let token = req.headers.authorization;

    if(typeof token === "undefined"){
        return res.send({ auth: "Failed. No Token" });
    } else {
        token = token.slice(7, token.length);
        jwt.verify(token, secret, function(err, decodedToken){

            if(err){
                return res.send({
                    auth: "Failed",
                    message: err.message
                });

            } else {

                req.user = decodedToken;
                next();
            }
        })
    }
};

// admin user verification
module.exports.verifyAdmin = (req, res, next) => {

	if(req.user && req.user.isAdmin){
		next()
	} else {
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}
}


// Error Handler
module.exports.errorHandler = (err, req, res, next) => {
	console.error(err)


	const errorMessage = err.message || 'Internal Server Error';
	const statusCode = err.status || 500

	res.status(statusCode).json({
		error: {
			message: errorMessage,
			errorCode: err.code || 'SERVER_ERROR',
			details: err.details || null
		}
	})
}
