const router = require('express').Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const User = require('../models/userModel');
const encrypt = require('../config/encrypt');
const keys = require('../config/keys');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));



router.post('/signup', (req, res) => {

    var username = req.body.name;
    var emailId = req.body.email;
    var password = encrypt.hash(req.body.password);

    console.log(username);
    var data = {
        "username": username,
        "email": emailId,
        "password": password
    }
    User.findOne({ email: emailId }).then((user) => {
        if (!user) {
            console.log("signup success new user");
            console.log(data);
            new User(data).save();
            res.render('login');
        } else {
            console.log("old user");
            res.render('login')
        }
    })

});



router.post('/loginValidate',
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/profile');
    });

router.get('/logout', (req, res) => {
    req.logout;
    res.redirect('/');
});


//auth with amazon
router.get('/amazon', passport.authenticate('amazon', {
    scope: ['profile']
}));



router.get('/amazon/redirect',
    passport.authenticate('amazon', { failureRedirect: '/auth' }),
    (req, res) => {
        //redirecting to login page  
        res.redirect('/profile');
    });

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    // res.send(req.user);
    res.redirect('/profile');
});




module.exports = router;