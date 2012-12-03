Gabscape = function()
{
	SB.Game.call(this);	
}

goog.inherits(Gabscape, SB.Game);

Gabscape.prototype.initialize = function(param)
{
	if (!param)
		param = {};
	
	if (!param.displayStats)
		param.displayStats = Gabscape.default_display_stats;

	this.twitterInfo = param.info;
	
	SB.Game.prototype.initialize.call(this, param);

	this.initEntities();

}


Gabscape.prototype.findGabber = function(gabberName) {
    var i;
    for (i = 0; i < this.gabbers.length; i++) {
        if (this.gabbers[i].name === gabberName) {
            return this.gabbers[i];
        }
    }
    return undefined;
}

Gabscape.prototype.initEntities = function()
{
	this.root = new SB.Entity;
	
	this.timer = new SB.Timer( { duration : 3333 } );
	this.root.addComponent(this.timer);
	this.timer.subscribe("time", this, this.onTimeChanged);
	this.timer.subscribe("fraction", this, this.onTimeFractionChanged);
	this.timer.start();
	
	this.initModels();

    this.gabbers = [];
    var i;
    for (i = 0; i < Gabscape.users.length; i++) {
        if (Gabscape.users[i] == Gabscape.user) {
            // Don't add yourself
            continue;
        }
        var g1 = new Gabber({name: Gabscape.users[i]});
        g1.name = Gabscape.users[i];
        g1.network = g1.network || {};
        g1.network.orientationInterpolationTime = 0.0;
        g1.network.positionInterpolationTime = 0.0;
        g1.transform.position.set(0, 0, 0);
        this.gabbers.push(g1);
    }


    for (i = 0; i < this.gabbers.length; i++) {
        this.root.addChild(this.gabbers[i]);
    }

	this.createViewer();
	this.createNetwork();

	this.activeGabber = null;

	this.addEntity(this.root);

	this.root.realize();
	
	this.initSound();
}

Gabscape.prototype.createViewer = function()
{
	this.viewer = SB.Prefabs.FPSController({ active : true, headlight : true,
		cameraPosition : new THREE.Vector3(0, 0, 5)});
	this.gabatar = new Gabatar({ info : this.twitterInfo });
	this.gabatar.transform.position.set(0, -2.5, 0);

	this.viewer.addChild(this.gabatar);

	this.root.addChild(this.viewer);
	
	this.viewer.transform.position.set(0, 2.5, 0);
}

Gabscape.prototype.createNetwork = function()
{
	this.network = new Gabscape_GabClient(Gabscape.user, this);
	this.network.connect();
	this.lastNetworkUpdateTime = 0;
    this.lastTweenUpdateTime = 0;
}

Gabscape.prototype.initModels = function()
{
	var modelpath = './models/';
	
	  this.initModel(modelpath + 'flatland01.js', 0, -5, 0);
		this.initModel(modelpath + 'trees01_rescaled.js', 15, 0, 15);
		this.initModel(modelpath + 'trees01_rescaled.js', -15, 1, 15);
		this.initModel(modelpath + 'trees01_rescaled.js', 15, 0, -15);
	  this.initModel(modelpath + 'trees01_rescaled.js', -15, 0, -15);
		this.initModel(modelpath + 'trees01_rescaled.js', 13, 0, 7);
		this.initModel(modelpath + 'trees01_rescaled.js', -13, 0, 7);
		this.initModel(modelpath + 'trees01_rescaled.js', 7, 0, 13);
	  this.initModel(modelpath + 'trees01_rescaled.js', 7, 0, -13); 
	  
	  this.initModel(modelpath + 'flatland01.js', 0, -2, 0);
		this.initModel(modelpath + 'trees01_rescaled.js', 8, 0, 9);
		this.initModel(modelpath + 'trees01_rescaled.js', -8, 1, 9);
		this.initModel(modelpath + 'trees01_rescaled.js', 8, 0, -9);
	  this.initModel(modelpath + 'trees01_rescaled.js', -8, 0, -9);
	  
		this.initModel(modelpath + 'trees01_rescaled.js', 11, 0, 10);
		this.initModel(modelpath + 'trees01_rescaled.js', -11, 0, 10);
		this.initModel(modelpath + 'trees01_rescaled.js', 11, 0, -10);
	  this.initModel(modelpath + 'trees01_rescaled.js', 11, 0, -10); 
	  
		this.initModel(modelpath + 'trees_conf01_rescaled.js', 12, 0, 0);
	  this.initModel(modelpath + 'trees_conf01_rescaled.js', -12, 0, 0);
	  this.initModel(modelpath + 'trees_conf01_rescaled.js', 0, 0, 12);
	  this.initModel(modelpath + 'trees_conf01_rescaled.js', 0, 0, -12);
	  
		this.initModel(modelpath + 'trees_conf01_rescaled.js', 15, 0, -5);
	  this.initModel(modelpath + 'trees_conf01_rescaled.js', -15, 0, -5);
	  this.initModel(modelpath + 'trees_conf01_rescaled.js', 5, 0, 15);
	  this.initModel(modelpath + 'trees_conf01_rescaled.js', -5, 0, -15);  
	  
		this.initModel(modelpath + 'cloud01_rescaled.js', -20, 8, -20);
	  this.initModel(modelpath + 'cloud01_rescaled.js', 20, 9, -20);
	  this.initModel(modelpath + 'cloud01_rescaled.js', -20, 10, 20);
	  this.initModel(modelpath + 'cloud01_rescaled.js', 20, 11, 20);
	  
	  this.initModel(modelpath + 'cloud01_rescaled.js', 15, 8, 0);
	  this.initModel(modelpath + 'cloud01_rescaled.js', -15, 9, 0);
	  this.initModel(modelpath + 'cloud01_rescaled.js', 0, 10, 16);
	  this.initModel(modelpath + 'cloud01_rescaled.js', 0, 11, -16);
	  
		this.initModel(modelpath + 'mountan01.js', -48, 0, 0);
	  this.initModel(modelpath + 'mountan01.js', 49, 0, -0);
	  this.initModel(modelpath + 'mountan01.js', 3, 0, -45);
	  this.initModel(modelpath + 'mountan01.js', -1, 0, 43);  
	  
		this.initModel(modelpath + 'moon01_rescaled.js', -50, 60, -50);
		this.initModel(modelpath + 'body_base_nopane.js', -10, 0, -10);
		this.initModel(modelpath + 'body_flying_nopane.js', 10, 0, 10);
		this.initModel(modelpath + 'body_flying2_nopane.js', 10, 0, -10);
		this.initModel(modelpath + 'body_hero_nopane.js', -10, 0, 10);
		this.initModel(modelpath + 'body_inactive_nopane.js', 0, 0, -15); 
		this.initModel(modelpath + 'failwhale.js', 20, 1.5, -25, 1); 
}

Gabscape.prototype.initModel = function(url, x, y, z)
{
       var entity = new SB.Entity();

	   var transform = new SB.Transform();
	   transform.position.x = x;
	   transform.position.y = y;
	   transform.position.z = z;
	   entity.addComponent(transform);
	   entity.transform = transform;

       var that = this;
       var model = SB.Model.loadModel(url, null, function(model) { that.onModelLoaded(model); });
       entity.addComponent(model);

       this.root.addChild(entity);
}

Gabscape.prototype.onModelLoaded = function(model)
{
	if (model)
	{
		model.applyShader(SB.Shaders.ToonShader);
	}
}

Gabscape.prototype.initSound = function()
{
	// Yikes, sound is broken --TP 2012/10/04
	return;
	
	sound_init();
}

Gabscape.prototype.selfSpawnEvent = function(twitterId, message) {
    var x = message.spawnposition.x;
    var y = message.spawnposition.y;
    var z = message.spawnposition.z;
    console.log('Got selfspawn for ' + twitterId + ' ' + x + ' ' + y + ' ' + z);
    this.viewer.transform.position.set(message.spawnposition.x, message.spawnposition.y, message.spawnposition.z);
    this.viewer.transform.rotation.set(message.spawnorientation.pitch, message.spawnorientation.yaw, message.spawnorientation.roll);
    var i, len = Gabscape.users.length;
    for (i = 0; i < len; i++)
    {
        if (Gabscape.users[i] === Gabscape.user) {
            // Don't subscribe to self.
            continue;
        }
        this.network.subscribeToUser(Gabscape.users[i]);
    }
}

Gabscape.prototype.positionChangeEvent = function(twitterId, message) {
    console.log('Got positionChangeEvent for ' + twitterId);

    var gabber = this.findGabber(twitterId);
    if (gabber === undefined) {
        console.log('Could not find gabber: ' + twitterId);
        return;
    }
    gabber.network = gabber.network || {};
    if (gabber.network.positionTarget === undefined) {
        // First time, take position
        gabber.transform.position.set(message.position.x, message.position.y, message.position.z);
    } else {
        // Jump to last network position
        // If we are interpolate quick enough, we shouldn't notice this.
        gabber.transform.position.set(gabber.network.positionTarget.x, gabber.network.positionTarget.y, gabber.network.positionTarget.z);
    }
    // Start interpolation
    gabber.network.positionSource = gabber.transform.position;
    gabber.network.positionTarget = message.position;
    gabber.network.positionInterpolationTime = 0.0;
}

Gabscape.prototype.orientationChangeEvent = function(twitterId, message) {
    console.log('Got orientationChangeEvent for ' + twitterId);

    var gabber = this.findGabber(twitterId);
    if (gabber === undefined) {
        console.log('Could not find gabber: ' + twitterId);
        return;
    }
    gabber.network = gabber.network || {};
    if (gabber.network.orientationTarget === undefined) {
        // First time, take orientation
        gabber.transform.rotation.set(message.orientation.pitch, message.orientation.yaw, message.orientation.roll);
    } else {
        // Jump to previous network orientation
        // If we are interpolate quick enough, we shouldn't notice this.
        gabber.transform.rotation.set(gabber.network.orientationTarget.pitch, gabber.network.orientationTarget.yaw, gabber.network.orientationTarget.roll);
    }
    // Start interpolation
    gabber.network.orientationSource = gabber.transform.rotation;
    gabber.network.orientationTarget = message.orientation;
    gabber.network.orientationInterpolationTime = 0.0;
}

Gabscape.prototype.actionEvent = function(twitterId, message) {
    console.log('Got actionEvent for ' + twitterId);
}

function orientationTween(t, source, target) {
    var x,y,z;
    x = ((1.0 - t) * source.x) + (t * target.pitch);
    y = ((1.0 - t) * source.y) + (t * target.yaw);
    z = ((1.0 - t) * source.z) + (t * target.roll);
    return {"x": x, "y": y, "z": z};
}

function positionTween(t, source, target) {
    var x,y,z;
    x = ((1.0 - t) * source.x) + (t * target.x);
    y = ((1.0 - t) * source.y) + (t * target.y);
    z = ((1.0 - t) * source.z) + (t * target.z);
    return {"x": x, "y": y, "z": z};
}
Gabscape.prototype.updateNetworkPositions = function(t) {
    var deltat = (t - this.lastTweenUpdateTime)/1000.0;
    this.lastTweenUpdateTime = t;
    var i;
    for (i = 0; i < this.gabbers.length; i++) {
        var gabber = this.gabbers[i];
        var gabnet = gabber.network;
        if (gabnet.positionSource === undefined || gabnet.positionTarget == undefined) {
            continue;
        }
        gabnet.positionInterpolationTime += deltat;
        if (gabnet.positionInterpolationTime > 1.0) {
            gabnet.positionInterpolationTime = 1.0;
        }
        var pt = positionTween(gabnet.positionInterpolationTime, gabnet.positionSource, gabnet.positionTarget);
        gabber.transform.position.set(pt.x, pt.y, pt.z);
    }

    for (i = 0; i < this.gabbers.length; i++) {
        var gabber = this.gabbers[i];
        var gabnet = gabber.network;
        if (gabnet.orientationSource === undefined || gabnet.orientationTarget == undefined) {
            continue;
        }
        gabnet.orientationInterpolationTime += deltat;
        if (gabnet.orientationInterpolationTime > 1.0) {
            gabnet.orientationInterpolationTime = 1.0;
        }
        var ot = orientationTween(gabnet.orientationInterpolationTime, gabnet.orientationSource, gabnet.orientationTarget);
        gabber.transform.rotation.set(ot.x, ot.y, ot.z);
    }
}

Gabscape.prototype.updateNetwork = function(t) 
{
	var deltat = t - this.lastNetworkUpdateTime;
	if (deltat > Gabscape.networkUpdateThreshold)
	{
		var pos = this.viewer.transform.position;
		this.network.updatePosition(pos.x, pos.y, pos.z);
		var rot = this.viewer.transform.rotation;
		this.network.updateOrientation(rot.x, rot.y, rot.z);
		this.lastNetworkUpdateTime = t;
	}
}

Gabscape.prototype.getTwitterData = function()
{
	var that = this;
	Gabulous.getTimeline(function(result, text) 
			{ that.timelineCallback(result, text); });
}

Gabscape.prototype.timelineCallback = function(result, responseText)
{
	var foo = result;
	var statusInfo = this.getStatusInfo(result);
	this.updateStatus(statusInfo);
	var that = this;
	Gabulous.getFriends(this.twitterInfo.screen_name, 
			function(result, text) { that.friendsCallback(result, text); });
}

Gabscape.prototype.friendsCallback = function(result, responseText)
{
	var foo = result;
	var friendsInfo = this.getFriendsInfo(result);
	
	this.updateFriends(friendsInfo);

	var that = this;
	Gabulous.getPublicTimeline(function(result, text) 
			{ that.publicTimelineCallback(result, text); });
}


Gabscape.prototype.publicTimelineCallback = function(result, responseText)
{
	var foo = result;
	var statusInfo = this.getStatusInfo(result);
    this.updatePublicTimeline(statusInfo);
}

Gabscape.prototype.updateStatus = function(message)
{
//	document.getElementById("status").innerHTML = message;
}

Gabscape.prototype.getStatusInfo = function(status)
{
	var info = "";
	var i, len = status.length;
	for (i = 0; i < len; i++)
	{
		var stat = status[i];
		
		info += (
	"<img src='" + stat.user.profile_image_url + "'>" +
	"<b>" + stat.user.name +"</b>" + " @" + stat.user.screen_name + "<br/>" + stat.text + "<br/>"
			);
	}	

	return info;
}

Gabscape.prototype.updateFriends = function(message)
{
//	document.getElementById("friends").innerHTML = message;
}

Gabscape.prototype.getFriendsInfo = function(friends)
{
	var info = "";
	var i, len = friends.length;
	for (i = 0; i < len; i++)
	{
		var friend = friends[i][0];
		
		info += (
	"<img src='" + friend.profile_image_url + "'>" +
	"<b>" + friend.name +"</b>" + " @" + friend.screen_name + "<br/>" + friend.status.text + "<br/>"
			);
	}	

	return info;
}

Gabscape.prototype.updatePublicTimeline = function(message)
{
	// document.getElementById("public").innerHTML = message;
}


Gabscape.prototype.onKeyDown = function(keyCode, charCode)
{
	this.whichKeyDown = keyCode;
	if (this.activeGabber)
		this.activeGabber.onKeyDown(keyCode, charCode);
	else
		SB.Game.prototype.onKeyDown.call(this, keyCode, charCode)
}

Gabscape.prototype.onKeyUp = function(keyCode, charCode)
{
	var mi;
	
	var handled = false;
	switch (String.fromCharCode(keyCode))
	{
    	case 'H' :
    		this.help();
    		handled = true;
    		break;
    		
    	case '1' :
    		mi = 1;
    		break;
    	case '2' :
    		mi = 2;
    		break;
    	case '3' :
    		mi = 3;
    		break;
    		
    	default : 
    		break;
	}

	if (!handled && this.activeGabber)
	{
		this.activeGabber.onKeyUp(keyCode, charCode);
	}
		
	if (mi)
	{
		var gabber = this.gabbers[mi-1];
		this.setActiveGabber(gabber);
	}

	if (!handled)
		SB.Game.prototype.onKeyUp.call(this, keyCode, charCode)
}

Gabscape.prototype.onKeyPress = function(keyCode, charCode)
{
	SB.Game.prototype.onKeyPress.call(this, keyCode, charCode)
}

Gabscape.prototype.onTimeChanged = function(t)
{
/*	
	if (!this.activeGabber)
	{
		var handled = false;
		
		switch (this.whichKeyDown)
		{
	    	case SB.Keyboard.KEY_LEFT : 
				this.turn(+1);
				handled = true;
	    		break;
	    	case SB.Keyboard.KEY_UP : 
				this.move(-1);
				handled = true;
	    		break;
	    	case SB.Keyboard.KEY_RIGHT : 
	    		this.turn(-1);
				handled = true;
	    		break;
	    	case SB.Keyboard.KEY_DOWN : 
    			this.move(+1);
				handled = true;
	    		break;
		}
		
		if (!handled)
		{
			switch (String.fromCharCode(this.whichKeyDown))
			{
		    	case 'A' :
					this.turn(+1);
		    		handled = true;
		    		break;
		    		
		    	case 'W' :
					this.move(-1);
		    		handled = true;
		    		break;
		    	case 'D' :
		    		this.turn(-1);
					handled = true;
		    		break;
		    	case 'S' :
	    			this.move(+1);
					handled = true;
		    		break;
		    		
		    	default : 
		    		break;
			}
		}
	}
	
*/
	
	this.updateNetworkPositions(t);
	this.updateNetwork(t);
}

Gabscape.prototype.onTimeFractionChanged = function(fraction)
{
	this.turnFraction = fraction;
}

Gabscape.prototype.move = function(direction)
{
	var delta = direction * .1666;
	var dir = new THREE.Vector3(0, 0, delta);
	this.viewer.move(dir);
	gain2.gain.value = 1;
}

Gabscape.prototype.turn = function(direction)
{
	var delta = direction * .0333;
	// this.viewer.transform.rotation.y -= delta;
	var dir = new THREE.Vector3(0, delta, 0);
	this.viewer.turn(dir);
}

Gabscape.prototype.setActiveGabber = function(gabber)
{
	if (this.activeGabber)
	{
		this.activeGabber.setActive(false);
	}
	
	gabber.setActive(true);
	
	this.activeGabber = gabber;
}

Gabscape.prototype.help = function()
{
	if (!this.helpScreen)
	{
		this.helpScreen = new GabscapeHelp();
	}
	
	this.helpScreen.show();
}

Gabscape.default_display_stats = false;
Gabscape.users = ["tony", "john", "mark", "don", "theo"];
Gabscape.user = "tony";
Gabscape.networkUpdateThreshold = 100;
