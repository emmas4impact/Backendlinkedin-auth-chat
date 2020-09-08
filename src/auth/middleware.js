const jwt = require("jsonwebtoken")
const profileModel = require("../routes/profiles/schema")
const { verifyJWT } = require("./index");
const { verify } = require("crypto");

const authorize = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        const verified = await verifyJWT(token)
        console.log(verified)
        const user = await profileModel.findOne({ _id: verified._id })
        //   console.log(user)
        if (!user) {
            throw new Error()
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.log(e)
        const err = new Error("Please authenticate");
        err.httpStatusCode = 401;
        next(err);
    }
}

module.exports = { authorize };