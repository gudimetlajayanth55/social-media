const passport = require('passport');
const bodyParser = require('body-parser');
const amazonStrategy = require('passport-amazon').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const keys = require('./keys');
const User = require('../models/userModel');
const encrypt = require('./encrypt');


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});


passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (encrypt.validate(user.password)) { return done(null, false); }
        return done(null, user);
    });
}));

passport.use(
    new amazonStrategy({
            clientID: keys.amazon.clientID,
            clientSecret: keys.amazon.clientSecret,
            callbackURL: '/auth/amazon/redirect'
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({ amazonId: profile.id }).then((currentUser) => {
                if (currentUser) {
                    // already have this user
                    console.log('user is: ', currentUser);
                    done(null, currentUser);

                } else {
                    // if not, create user in our db
                    console.log(profile._json);
                    new User({
                        amazonId: profile.id,
                        username: profile.displayName,
                    }).save().then((newUser) => {
                        console.log('created new user: ', newUser);
                        done(null, newUser);
                    });
                }
            });
        })
);



passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our own db
        User.findOne({ googleId: profile.id }).then((currentUser) => {
            if (currentUser) {
                // already have this user
                console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                // if not, create user in our db
                console.log(profile._json);
                new User({
                    googleId: profile.id,
                    username: profile.displayName,
                }).save().then((newUser) => {
                    console.log('created new user: ', newUser);
                    done(null, newUser);
                });
            }
        });
    })
);