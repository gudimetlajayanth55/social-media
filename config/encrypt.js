const crypto = require('crypto');
const keys = require('./keys');
module.exports = {
    hash(password) {
        salt = keys.password.salt;
        var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
        return hash;
    },
    validate(password) {
        salt = keys.password.salt;
        var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
        return hash === password;
    }
}