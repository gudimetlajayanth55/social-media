const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const keys = require('../config/keys');

const userSchema = new Schema({
    googleId: String,
    amazonId: String,
    username: String,
    email: String,
    password: String
});

const User = mongoose.model('user', userSchema);

module.exports = User;