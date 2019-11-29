const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const passportSetup = require('./config/passportSetup');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
const app = express();

app.use('/public', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("connected to database");
});

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);


app.get('/signup', (req, res) => {
    res.render('signup');
})

app.get('/', (req, res) => {
    res.render('login', { user: req.user });
});

app.listen(3000, () => {
    console.log('app is listening on port 3000');
});