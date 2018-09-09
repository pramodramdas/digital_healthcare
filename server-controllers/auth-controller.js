const { validate_jwt } = require("../server-utils/jwt-util");

const verify_token = (req, res, next) => {
    let token = req.headers.token || req.query.token;

    if(token) {
        validate_jwt(token, (err, decoded) => {
            if(!err) {
                res.locals.decoded = decoded;
                next();
            }
            else
                res.status(403).send(err);
        });
    }
    else
        res.status(403).send("error");
}

module.exports = {
    verify_token
}