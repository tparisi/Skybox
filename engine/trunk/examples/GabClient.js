function GabClient(twitterId) {
    this.yourTwitterId = twitterId;
    this.spawned = false;
    this.cache = {};
    this.cache.position = {};
    this.cache.position.x = 0.0;
    this.cache.position.y = 0.0;
    this.cache.position.z = 0.0;
    this.cache.orientation = {};
    this.cache.orientation.pitch = 0.0;
    this.cache.orientation.yaw = 0.0;
    this.cache.orientation.roll = 0.0;
}

GabClient.prototype.selfSpawnEvent = function(twitterId, message) {
    console.log('override selfSpawnEvent');
}

GabClient.prototype.positionChangeEvent = function(twitterId, message) {
    console.log('override positionChangeEvent');
}

GabClient.prototype.orientationChangeEvent = function(twitterId, message) {
    console.log('override orientationChangeEvent');
}

GabClient.prototype.actionEvent = function(twitterId, message) {
    console.log('override actionEvent');
}

GabClient.prototype._messageListener = function(path, message) {
    var pathChunks = path.split('/');
    var messageTarget = pathChunks[2];
    var messageType = pathChunks[3];
    switch (messageType) {
        case 'position_update':
            this.positionChangeEvent(messageTarget, message);
            break;
        case 'orientation_update':
            this.orientationChangeEvent(messageTarget, message);
            break;
        case 'action':
            this.actionEvent(messageTarget, message);
            break;
        case 'selfspawn':
            this.spawned = true;
            this.selfSpawnEvent(messageTarget, message);
            break;
        default:
            alert('Got Gab message of unknown type' + messageType + ' from ' + message.senderTwitterId);
    }
}

GabClient.prototype.connect = function() {
    var me = this;
    this.client = new Faye.Client('http://10.104.86.106:8080/gab');
    this.client.connect(function() {
        me.connectListener();
    });
}

GabClient.prototype.connectListener = function() {
    // Subscribe to actions that target yourTwitterId
    var me = this;
    var msgPathSelfspawn = '/gab/' + this.yourTwitterId + '/selfspawn';
    this.client.subscribe(msgPathSelfspawn, function gs_self_selfspawn_message(message) {
        me._messageListener(msgPathSelfspawn, message);
    });
    msgPathAction = '/gab/' + this.yourTwitterId + '/action';
    this.client.subscribe(msgPathAction, function gs_self_action_message(message) {
        me._messageListener(msgPathAction, message);
    });
}

GabClient.prototype.subscribeToUser = function(twitterId) {
    // Subscribe to users action trigger
    var me = this;
    var msgPathAction = '/gab/' + twitterId + '/action';
    this.client.subscribe(msgPathAction, function gs_other_action_message(message) {
        me._messageListener(msgPathAction, message);
    });

    // Subscribe to users position update
    var msgPathPosition = '/gab/' + twitterId + '/position_update';
    this.client.subscribe(msgPathPosition, function gs_other_action_message(message) {
        me._messageListener(msgPathPosition, message);
    });

    // Subscribe to users orientation update
    var msgPathOrientation = '/gab/' + twitterId + '/orientation_update';
    this.client.subscribe(msgPathOrientation, function gs_other_action_message(message) {
        me._messageListener(msgPathOrientation, message);
    });

    // Request spawn information for user
    this.client.publish('/gab/' + this.yourTwitterId + '/spawn_positions', { users: [twitterId] });
}

GabClient.prototype.updatePosition = function(x,y,z) {
    // Only send if position changed
    if (this.cache.position.x != x ||
        this.cache.position.y != y ||
        this.cache.position.z != z) {
        // Update cache
        this.cache.position.x = x;
        this.cache.position.y = y;
        this.cache.position.z = z;
        var message = {};
        message.senderTwitterId = this.yourTwitterId;
        message.senderClientId = this.client.getClientId();
        message.position = this.cache.position;
        this.client.publish('/gab/' + this.yourTwitterId + '/position_update', message);
    }

}
GabClient.prototype.updateOrientation = function(pitch,yaw,roll) {
    if (this.cache.orientation.pitch != pitch ||
        this.cache.orientation.yaw != yaw ||
        this.cache.orientation.roll != roll) {
        // Update cache
        this.cache.orientation.pitch = pitch;
        this.cache.orientation.yaw = yaw;
        this.cache.orientation.roll = roll;
        var message = {};
        message.senderTwitterId = this.yourTwitterId;
        message.senderClientId = this.client.getClientId();
        message.orientation = this.cache.orientation;
        this.client.publish('/gab/' + this.yourTwitterId + '/orientation_update', message);
    }
}

GabClient.prototype.sendActionToUser = function(twitterId, action) {
    var message = {};
    message.action = action;
    message.senderTwitterId = this.yourTwitterId;
    message.senderClientId = this.client.getClientId();
    this.client.publish('/gab/' + twitterId + '/action', message);
}