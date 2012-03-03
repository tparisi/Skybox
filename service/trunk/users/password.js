var bcrypt = require('bcrypt');

var SALT_SIZE = 10;

exports.hash = function hash(text) {
    return bcrypt.encrypt_sync(text,  bcrypt.gen_salt_sync(SALT_SIZE));
};

exports.compare = function(password, hash) {
	return bcrypt.compare_sync(password, hash);
}
