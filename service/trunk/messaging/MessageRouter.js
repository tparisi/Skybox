var util = require('util');
var Common = require('../Common.js');

/**
 * Instantiate a new MessageRouter.
 * MessageRouters are responsible for publishing messages to attached clients.
 * @param adapter the adapter used to publish messages
 * @returns
 */
function MessageRouter(adapter, sessionStore) {
	this.sessionStore = sessionStore;
	this.cometAdapter = adapter;
	this.cometAdapter.addExtension(this);
	this.authFunction = null;
}

var p = MessageRouter.prototype;
var SERVER_SECRET_KEY = 'b9b85ae6d6e496a8a9d3ba64f4fed070';

p.setAuthFunction = function(authFn) {
	this.authFunction = authFn;
}

p.routeMessage = function(channel, operation, objectType, data) {
	this.cometAdapter.getClient().publish(channel, createCommand(operation, objectType, data));
};

// authenticate incoming messages
p.incoming = function(message, callback) {
	if (message.channel == '/meta/subscribe') {
		// Get subscribed channel and auth token
	    var subscription = message.subscription,
	        authToken     = message.ext && message.ext.authToken;
	    
	    if (!authToken) {
	    	message.error = 'Missing authToken';
	    	callback(message);
	    }
	    else {
	    	console.log('authenticating authToken ' + authToken + ' on channel ' + message.channel);
	    	if (!this.authFunction) {
	    		console.log('No auth function!');
	    		message.error = 'No auth function defined.';
	    		callback(message);
	    	}
	    	else {
	    		this.authFunction(this.sessionStore, authToken, message.channel, function(err, authResult) {
	    			// Common.authMgr.authenticateSubscriber(authToken, message.channel, function(err, authResult) {
	    			if (err) {
	    				console.log('Error authenticating user: ' + err);
	    				message.error = 'Could not authenticate user.';
	    			}
	    			else if (!authResult) {
	    				console.log('Authentication failed');
	    				message.error = 'Authentication failed';
	    			}
	    			console.log('auth OK');
	    			callback(message);
	    		});
	    	}
	    }
	}
//	else if (!message.channel.indexOf('/meta') == 0){
//		// need to make sure that non-meta-channel messages originated from the server 
//		var token = message.data && message.data.ext && message.data.ext.token;
//		if (token != SERVER_SECRET_KEY) {
//			message.error = 'Message could not be authenticated';
//		}
//		else {
//			if (message.data && message.data.ext) {
//				delete message.data.ext;
//			}
//		}
//		callback(message);
//	}
	else {
		// be sure to call callback for non-filtered messages
		callback(message);
	}
};

p.outgoing = function(message, callback) {
	console.log('outgoing message: ' + JSON.stringify(message));
	// no need to authenticate outgoing messages for now, since they always originate at the server
	callback(message);
};


function createCommand(operation, objectType, data) {
	return {
		'operation' : operation,
		'type' : objectType,
		'data' : data,
		'ext' : { 'token' : SERVER_SECRET_KEY}
	};
};

module.exports = MessageRouter;