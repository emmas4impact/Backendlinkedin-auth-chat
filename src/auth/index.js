require("dotenv").config()
const jwt = require("jsonwebtoken")
const User = require("../routes/profiles/schema")
const { verify } = require("crypto")
//function that gives us a user and gets a token
const authenticate = async (user) => {
    try {
        // generate new tokens
        const newAccessToken = await generateJWT({ _id: user._id });
        // console.log(newAccessToken)
        await user.save();
        return newAccessToken;
    } catch (error) {
        console.log(error)
        throw new Error("problem with authentication")
    }
}

const generateJWT = (payload) => new Promise((res, rej) => {
    jwt.sign(
        payload,
        "97a264eeca023fcfd5b53f53b0cb2393527f6301b27549f98dd0e566a55cd38d66e08720c87b875933305cfa4d21ada860cd0278bcaae42e8823865a322ddaf2",
        { expiresIn: '1h' },
        (err, token) => {
            if (err) rej(err)
            res(token)
        }
    )
})

const verifyJWT = (token) => new Promise((res, rej) => {
    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, verified) => {
            if (err) rej(err)
            res(verified)
        }
    )
})

module.exports = { authenticate, verifyJWT }









