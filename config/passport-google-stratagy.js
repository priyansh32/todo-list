const passport = require('passport')
const googleStratagy = require('passport-google-oauth').OAuth2Strategy

const User = require('../model/user')

passport.use(new googleStratagy({
    clientID: process.env.GOOGLEOAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLEOAUTH_CLIENT_SECRET,
    callbackURL: process.env.GOOGLEOAUTH_REDIRECT_URI,
},
    async function (accessToken, refreshToken, profile, done) {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            return done(null, user);
        } else {
            console.log(profile)
            let user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
            });

            try {
                await user.save();
                return done(null, user);
            }
            catch (err) {
                return console.error('saving the user failed: ', err)
            }
        }
    }
))
passport.serializeUser(function (user, done) {
    done(null, user.id)
})

// deserialising the user from the key in the cookies
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) {
            console.log('Error in finding the user --> Passport')
        }
        return done(null, user)
    })
})
passport.setAuthenticatedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        // req.user contains the current signed in user from the cookies
        res.locals.user = req.user;
    }
    next()
}
module.exports = passport