var Common = require('../Common.js');
/*
 * GET home page.
 */
exports.index = function(req, res){
	if (req.session.user) {
		res.redirect('/games');
	}
	else {
		res.redirect('/login');
	}
};

exports.viewLogin = function(req, res) {
	// check for user in session and redirect as appropriate
	if (req.session.user) {
		res.redirect('/');
	}
	res.render('login', { title : 'Login', user : {}, errors : false });
};

exports.login = function(req, res) {
	var user = req.param('user');
	if (req.form.isValid == false) {
		console.log('validation failed');
		res.render('login', { title : 'Login', 'user' : user, errors : req.form.errors });
	}
	else {
		console.log('authenticating user = ' + JSON.stringify(user));
		Common.authMgr.authenticateUser(user.username, user.password, function(err, authStatus) {
			if (err) {
				// ?
			}
			else {
				if (authStatus) {
					req.session.user = user;
			        res.setHeader('Content-Type', 'text/html');
			        console.log('session id = ' + req.session.id);
					res.cookie('authToken', req.session.id, { expires: new Date(Date.now() + 900000), path : '/' });
					res.write('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN"><html><head><title>Login Successful</title>');
					res.write('<meta http-equiv="REFRESH" content="0;url=http://' + req.header('host') + '/games"></HEAD><BODY></BODY></HTML>');
					res.end();
					console.log('auth OK.  sent redirect.');			
				}	
				else {
					console.log('authentication failed');
					res.render('login', { title : 'Login', 'user' : user });
				}
							
			}
			
		})
		
	}
};

exports.listGames = function(req, res) {
	var games = [];
	for (id in Common.games) {
		games.push(Common.games[id]);
	}
	res.render('games', {title : 'Games', 'games' : games}); 
};

exports.viewGame = function(req, res) {
	var gameId = req.param('gameId');
	if (!gameId || !Common.games[gameId]) {
		console.log('Invalid gameId: ' + gameId);
		// res.render('games', {title : 'Games', 'games' : Common.games});
		res.redirect('/games');
	}
	else {
		var game = Common.games[gameId];
		res.render('game', {title: game.name, 'game' : game});
	}
};
