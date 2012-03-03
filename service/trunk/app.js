
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , faye = require('faye')
  , MessageRouter = require('./messaging/MessageRouter.js'),
  Common = require('./Common.js');
var form = require('express-form'),
	filter = form.filter,
	validate = form.validate;

var sessionHashKey = '503c08118f80ef10f3f99f303c15dc32';

var app = module.exports = express.createServer();

var cometAdapter = new faye.NodeAdapter({mount: '/comet', timeout: 45});
var sessionStore = new express.session.MemoryStore;
var msgRouter = new MessageRouter(cometAdapter, sessionStore);
msgRouter.setAuthFunction(Common.authMgr.authenticateSubscriber);


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: sessionHashKey, store : sessionStore }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
app.get('/login', routes.viewLogin);
app.post('/login', 
		form(
				filter('user[username]').trim(),
				validate('user[username]', 'Username').required('Please enter a username.'), // .is(/^\w{6,16}$/, 'Invalid username.')
				filter('user[password]').trim(),
				validate('user[password]', 'Password').required('Please enter a password') // .is(/^.{6,16}$/, 'Invalid password')
		),
routes.login);
app.get('/games', routes.listGames);
app.get('/game_lobby', routes.listGameSessions);
app.get('/game', routes.viewGame);

cometAdapter.attach(app);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
