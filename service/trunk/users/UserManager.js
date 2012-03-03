var util = require('util');
var BaseDao = require('../db/BaseDao');

function UserManager() {
	UserManager.super_.call(this);
}

util.inherits(UserManager, BaseDao);
var p = UserManager.prototype;

p.getMutablePropertyNames = function() {
	return ["password", "first_name", "last_name",
	        "email_address", "birthdate",
	        "phone", "date_updated", 
	        "date_last_login"];
};


/**
 * Retrieve a User from the DB by ID.
 * criteria must contain an 'id' attribute.
 * Passes a User to the callback upon successful retrieval.
 */
p.read = function(criteria, cb) {
	if (!criteria.id) {
		throw new Error('Criteria must have an id attribute');
	}
	BaseDao.prototype.getObjectById.call(this, criteria.id, function(err, data) {
		if (err) {
			cb(err);
		}
		else {
			cb(null, data);
		}
	});
};



p.create = function(user, cb) {
	// hash the password
	user.password = pw.hash(user.password);
	BaseDao.prototype.create.call(this, user, cb);
};

p.update = function(user, cb) {
	BaseDao.prototype.update.call(this, user, cb);
};

p.remove = function(user, cb) {
	BaseDao.prototype.remove.call(this, user, cb);
};


module.exports = UserManager;