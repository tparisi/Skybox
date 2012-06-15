function Gabscape_GabClient(twitterId, target) {
	GabClient.call(this, twitterId);
	this.target = target;
}

Gabscape_GabClient.prototype = new GabClient;

Gabscape_GabClient.prototype.selfSpawnEvent = function(twitterId, message) {
    this.target.selfSpawnEvent.call(this.target, twitterId, message);
}

Gabscape_GabClient.prototype.positionChangeEvent = function(twitterId, message) {
	this.target.positionChangeEvent.call(this.target, twitterId, message)
}

Gabscape_GabClient.prototype.orientationChangeEvent = function(twitterId, message) {
	this.target.orientationChangeEvent.call(this.target, twitterId, message)
}

GabClient.prototype.actionEvent = function(twitterId, message) {
	this.target.orientationChangeEvent.call(this.target, twitterId, message)
}
