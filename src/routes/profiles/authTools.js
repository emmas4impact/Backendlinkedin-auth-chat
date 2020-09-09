const jwt = require("jsonwebtoken") ;
const facebookModel = require("./facebookSchema");
const LinkedInModel = require("./linkedinSchema");
const passport = require("passport");
const facebookStrategy = require("passport-facebook").Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

const authenticate = async (user) => {
  try {
    // generate tokens
    const newAccessToken = await generateJWT({ _id: user._id }) ;
    await user.save() ;
    return { token: newAccessToken } ;
  } catch (error) {
    console.log(error) ;
    throw new Error(error) ;
  }
} ;

const generateJWT = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: "5m" },
      (err, token) => {
        if (err) rej(err) ;
        res(token) ;
      }
    )
  ) ;

const verifyJWT = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token,  process.env.SECRET_KEY, (err, decoded) => {
      if (err) rej(err) ;
      res(decoded) ;
    })
  ) ;

  passport.use(
    new facebookStrategy({
    clientID: '342521156896557',
    clientSecret: 'e5f8413e7a2c47be5951c6577905109b',
    callbackURL: "http://localhost:3006/profile/facebook/",
    profileFields: ['id', 'displayName', 'first_name', 'last_name', 'gender','profileUrl'],
    enableProof: true
  },
  async (request, accessToken, refreshToken, profile, done) => {
      const newUser = {
          facebookId: profile.id,
          firstName: profile.name.givenName,
          lastName:profile.name.familyName,
          fullName:profile.displayName
        };   
        try {
      const user = await facebookModel.findOne({ facebookId: profile.id });
      if (user) {
        const tokens = await authenticate(user);
        done(null, { user, tokens });
      } else {
          console.log('else' , newUser)
        let createdUser = await facebookModel.create(newUser);
        const tokens = await authenticate(createdUser);
        done(null, { user, tokens });
      }
    } catch (error) {
      console.log(error);
      done(error);
    }
  }
));

 
passport.use(new LinkedInStrategy({
  clientID: '78si2ah6m6mlug',
  clientSecret: 'UtBh1gUnj357wgs8',
  callbackURL: "http://localhost:3006/profile/auth/linkedin/callback",
  scope: ['r_emailaddress', 'r_liteprofile'],
  state: true
}, function(accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick( async function () {
    //   console.log(profile)
      const newUser = {
          name: profile.name.givenName,
          surname:profile.name.familyName,
          displayName:profile.displayName,
          image:profile.photos[0].value,
          email: profile.emails[0].value,
          LinkedinId: profile.id,
      };
    try {
        const user = await LinkedInModel.findOne({ LinkedinId: profile.id });
        if (user) {
          const tokens = await authenticate(user);
          done(null, { user, tokens });
        } else {
          let createdUser = await LinkedInModel.create(newUser);
          const tokens = await authenticate(createdUser);
          done(null, { user, tokens });
        }
      } catch (error) {
        console.log(error);
        done(error);
      }
    return done(null, profile);
  });
}));
passport.serializeUser(function (user, done) {
    done(null, user);
});
  
passport.deserializeUser(function (user, done) {
    done(null, user);
});




module.exports = { authenticate, verifyJWT};

