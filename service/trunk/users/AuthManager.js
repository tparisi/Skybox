/**
 * AuthManager.js
 * Handles user authentication
 * 
 */

var DBManager = require('../db/DBManager');
var pw = require('./password');

function AuthManager() {
	console.log('Instantiating AuthManager');
	this.dbMgr = new DBManager();
	this.db = this.dbMgr.getDb();
}


var p = AuthManager.prototype;


/**
 * Ensure that a previously authenticated user is associated with the request
 * @param req the request
 * @param res the response
 * @param next the next route
 */
p.checkAuthenticatedUser = function (req) {
	if (!req.session.username) {
		return false;
	}
	else {
		return true;
	}
};


/**
 * Authenticate a user with username and password
 * @param username
 * @param password
 * @param callback
 */
p.authenticateUser = function(username, password, callback) {
	console.log('authenticating user ' + username);
	// for now just make sure they supply a username
	if (username) {
		// TODO: should pass the user object from the DB to the callback
		callback(null, true);
	}
	else {
		callback(null, null);
	}
}


/**
 * Authenticate a subscription to a message bus channel
 * @param authToken
 * @param channel
 * @param callback
 */
p.authenticateSubscriber = function(sessionStore, authToken, channel, callback) {
	sessionStore.get(authToken, function(err, session) {
		if (err) {
			console.log('Error authenticating subscriber: ' +err);
			callback(err);
		}
		else {
			if (session) {
				console.log('session found: ' + JSON.stringify(session));    			
				// should make sure they have access rights to the project they are trying to subscribe to
				callback(null, true);
			}
			else {
				console.log('No session found');
				callback(null, false);
			}
		}
	});    	
}

module.exports = AuthManager;