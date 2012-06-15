
function GameSession(game, sid) {
	this.game = game;
	this.sessionId = sid;
	this.players = [];
	this.status = STATUS_GATHERING;
};


var STATUS_GATHERING = 0;
var STATUS_RUNNING = 1;
var STAUS_OVER = 2;

var p = GameSession.prototype;

p.join = function(player, callback) {
	if (players.length < game.maxPlayers && this.status == STATUS_GATHERING) {
		players.push(player);
		callback(null, this);
	}
	else {
		callback('Game not joinable');
	}
};

p.leave = function(player) {
	players = players.filter(p) {
		return p.id != player.id;
	}
};



module.exports = GameSession;
