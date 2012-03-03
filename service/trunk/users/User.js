var BaseObject = require('../BaseObject');
var util = require('util');
var globals = require('../Globals');

function User(data) {
	User.super_.call(this, globals.TYPE_USER, data);
	if (data) {
		this.username = data.username;
		this.organization = data.organization;
		this.password = data.password;
		this.first_name = data.first_name;
		this.last_name = data.last_name;
		this.birthdate = data.birthdate;
		this.email_address = data.email_address;
		this.phone = data.phone;
		this.date_updated = data.date_updated;
		this.date_last_login = data.date_last_login;
	}
}

util.inherits(User, BaseObject);
var p = User.prototype;

p.toDoc = function() {
	var doc = { 
			"type" : this.getType(),
			"username" : this.username,
			"organization" : this.organization,
			"password" : this.password,
			"first_name" : this.first_name,
			"last_name" : this.last_name,
			"birthdate" : this.birthdate,
			"email_address" : this.email_address,
			"phone" : this.phone,
			"date_updated" : this.date_updated
			};
	return doc;
};

module.exports = User;
