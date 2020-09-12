const jwt = require("jsonwebtoken") ;
const profileModel = require("../../src/routes/profiles/schema") ;
const { verifyJWT } = require("../../src/routes/profiles/authTools") ;

const authorize = async (req, res, next) => {
  console.log("COOKIES:", req.cookies)
  try {
    const token = req.cookies.accessToken
    console.log(process.env.SECRET_KEY)
    //console.log("*****************************", req.cookies.accessToken);
    const decoded = await verifyJWT(token);
    console.log(decoded)
    const user = await profileModel.findOne({
      _id: decoded._id,
    }) ;
   
    if (!user) {
        throw new Error() ;
    }
    req.token = token;
    req.user = user ;
    //console.log("Token line 21",user)
    next() ;
  } catch (e) {
      console.log(e)
    const err = new Error("Please authenticate") ;
    err.httpStatusCode = 401 ;
    next(err) ;
  }
} ;

const adminOnlyMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "admin") next() ;
  else {
    const err = new Error("Only for admins!") ;
    err.httpStatusCode = 403 ;
    next(err) ;
  }
} ;

module.exports = { authorize, adminOnlyMiddleware } ;