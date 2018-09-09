let jwt = require('jsonwebtoken');

const encode_jwt = function (obj) {
	// 30 minutes
	const jwtToken = jwt.sign(obj,
					process.env.JWT_TOKEN_SECRET,
					{ expiresIn: parseInt(process.env.JWT_EXPIRE_TIME) }
				);
	//obj.token = jwtToken;
	return jwtToken;
}

const validate_jwt = (token, callback) => {
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, function(err, decoded) {
		if(!err && decoded.client_address){
			callback(null, decoded);
		}
		else {
			console.log(err);
			callback("error", null);
		}   
    });
}

module.exports = {
	encode_jwt,
	validate_jwt
}