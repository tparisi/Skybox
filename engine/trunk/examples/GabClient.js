function GabClient(twitterId) {
    this.yourTwitterId = twitterId;
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
    pathChunks = path.split("/");
    messageTarget = pathChunks[2];
    messageType = pathChunks[3];
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
    var me = this;
    // Subscribe to actions that target yourTwitterId
    var msgPath = '/gab/' + this.yourTwitterId + '/action';
    this.client.subscribe(msgPath, function gs_self_action_message(message) {
        me._messageListener(msgPath, message);
    });
}

GabClient.prototype.subscribeToUser = function(twitterId) {
    var me = this;
    // Subscribe to users action trigger
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
        message = {};
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
        message = {};
        message.senderTwitterId = this.yourTwitterId;
        message.senderClientId = this.client.getClientId();
        message.orientation = this.cache.orientation;
        this.client.publish('/gab/' + this.yourTwitterId + '/orientation_update', message);
    }
}

GabClient.prototype.sendActionToUser = function(twitterId, action) {
    action.senderTwitterId = this.yourTwitterId;
    this.client.publish('/gab/' + twitterId + '/action', action);
}