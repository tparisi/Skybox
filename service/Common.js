var AuthManager = require('./users/AuthManager.js');
var express = require('express');

Common = {
		authMgr : new AuthManager(),
		games : {
	             '7f9a8dee3d' : {
	            	 name : 'Pucks', 
	            	 id : '7f9a8dee3d',
	            	 minPlayers : 2,
	            	 maxPlayers : 2
	            },
	             '96adb84d24' : { 
	            	 name : 'Kill the Dragon', 
	            	 id : '96adb84d24',
	            	 minPlayers : 2,
	            	 maxPlayers : 4}
}
};

module.exports = Common;