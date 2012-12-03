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


Gabscape.prototype.initEntities = function()
{
	this.root = new SB.Entity;
	
//	var grid = new SB.Grid({size:64});
//	this.root.addComponent(grid);
	
	var g1 = new Gabber({name: "Gabber1" });
	g1.transform.position.set(15, 0, -20);

	/*
	var g2 = new Gabber({name: "Gabber2" });
	g2.transform.position.set(-25, 0, -33);

	var g3 = new Gabber({name: "Gabber3" });
	g3.transform.position.set(0, 0, -15);
	*/
	
	var viewer = SB.Prefabs.FPSController({ active : true, headlight : true,
		cameraPosition : new THREE.Vector3(0, 0, 5) });
	this.gabatar = new Gabatar({ info : this.twitterInfo });
	this.gabatar.transform.position.set(0, -2.5, 0);
	viewer.addChild(this.gabatar);
	
	viewer.transform.position.set(0, 2.5, 0);
	
	this.gabbers = [g1]; // , g2, g3];
	this.activeGabber = null;
	
	this.root.addChild(g1);
//	this.root.addChild(g2);
//	this.root.addChild(g3);
	this.root.addChild(viewer);
	
	this.addEntity(this.root);

	this.root.realize();
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
	return;
	
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
}

Gabscape.prototype.onTimeFractionChanged = function(fraction)
{
	this.turnFraction = fraction;
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
