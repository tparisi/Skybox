
goog.require('SB.Prefabs');

SB.Prefabs.WalkthroughController = function(param)
{
	var controller = new SB.Entity(param);
	var transform = new SB.Transform;
	controller.addComponent(transform);
	controller.transform.position.set(0, 0, 5);
	var controllerScript = new SB.WalkthroughControllerScript;
	controller.addComponent(controllerScript);

	var dragger = new SB.Dragger();
	var rotator = new SB.Rotator();
	var timer = new SB.Timer( { duration : 3333 } );
	
	controller.addComponent(dragger);
	controller.addComponent(rotator);
	controller.addComponent(timer);

	dragger.subscribe("move", controllerScript, controllerScript.onDraggerMove);
	rotator.subscribe("rotate", controllerScript, controllerScript.onRotatorRotate);
	timer.subscribe("time", controllerScript, controllerScript.onTimeChanged);
	timer.subscribe("fraction", controllerScript, controllerScript.onTimeFractionChanged);	
	
	var viewpoint = new SB.Entity;
	var transform = new SB.Transform;
	var camera = new SB.Camera({active:param.active, fov:param.fov});
	viewpoint.addComponent(transform);
	viewpoint.addComponent(camera);
	viewpoint.transform = transform;
	viewpoint.camera = camera;

	controller.addChild(viewpoint);

	var intensity = param.headlight ? 1 : 0;
	var color = param.headlight ? 0xFFFFFF : 0;
	
	var headlight = new SB.DirectionalLight({ color : color, intensity : intensity });
	controller.addComponent(headlight);
	
	return controller;
}

goog.provide('SB.WalkthroughControllerScript');
goog.require('SB.Component');

SB.WalkthroughControllerScript = function(param)
{
	SB.Component.call(this, param);

	this.directionMatrix = new THREE.Matrix4;
	this.moveDir = new THREE.Vector3;
	this.turnDir = new THREE.Vector3;
	this.cameraPos = null;
	
	this.lastdy = 0;
	this.dragging = false;
}

goog.inherits(SB.WalkthroughControllerScript, SB.Component);

SB.WalkthroughControllerScript.prototype.realize = function()
{
	this.dragger = this._entity.getComponent(SB.Dragger);
	this.rotator = this._entity.getComponent(SB.Rotator);
	this.timer = this._entity.getComponent(SB.Timer);
	this.viewpoint = this._entity.getChild(0);
	
	SB.Game.instance.mouseDelegate = this;
	SB.Game.instance.keyboardDelegate = this;
}

SB.WalkthroughControllerScript.prototype.update = function()
{
	if (this.cameraPos)
	{
		this._entity.transform.position.copy(this.cameraPos);
		this.cameraPos = null;
	}
}

SB.WalkthroughControllerScript.prototype.move = function(dir)
{
	this.directionMatrix.identity();
	this.directionMatrix.setRotationFromEuler(this._entity.transform.rotation);
	dir = this.directionMatrix.multiplyVector3(dir);
	this._entity.transform.position.addSelf(dir);
}

SB.WalkthroughControllerScript.prototype.turn = function(dir)
{
	this._entity.transform.rotation.addSelf(dir);
}


SB.WalkthroughControllerScript.prototype.onMouseMove = function(x, y)
{
	this.dragger.set(x, y);
	this.rotator.set(x, y);
}

SB.WalkthroughControllerScript.prototype.onMouseDown = function(x, y)
{
	this.dragger.start(x, y);
	this.rotator.start(x, y);
	this.dragging = true;
}

SB.WalkthroughControllerScript.prototype.onMouseUp = function(x, y)
{
	this.dragger.stop(x, y);
	this.rotator.stop(x, y);
	this.dragging = false;
	this.lastdy = 0;
}

SB.WalkthroughControllerScript.prototype.onMouseScroll = function(delta)
{
	this.moveDir.set(0, 0, -delta);
	this.move(this.moveDir);
}

SB.WalkthroughControllerScript.prototype.onKeyDown = function(keyCode, charCode)
{
	this.whichKeyDown = keyCode;
	
	this.timer.start();
}

SB.WalkthroughControllerScript.prototype.onKeyUp = function(keyCode, charCode)
{
	this.lastdy = 0;
	this.whichKeyDown = 0;
	this.turnFraction = 0;
	
	this.timer.stop();
}

SB.WalkthroughControllerScript.prototype.onKeyPress = function(keyCode, charCode)
{
}


SB.WalkthroughControllerScript.prototype.onRotatorRotate = function(axis, delta)
{
	delta *= .666;
	
	if (delta != 0)
	{
		// this.controllerScript.transform.rotation.y -= delta;
		this.turnDir.set(0, -delta, 0);
		this.turn(this.turnDir);
		this.lastrotate = delta;
	}
}

SB.WalkthroughControllerScript.prototype.onDraggerMove = function(dx, dy)
{
	if (Math.abs(dy) <= 2)
		dy = 0;
	
	dy *= .02;
	
	if (dy)
	{
		this.lastdy = dy;
	}
	else if (this.lastdy && this.dragging)
	{
		dy = this.lastdy;
	}

	if (dy != 0)
	{
		// this.controllerScript.transform.position.z -= dy;
		this.moveDir.set(0, 0, -dy);
		this.move(this.moveDir);
	}
}

SB.WalkthroughControllerScript.prototype.onTimeChanged = function(t)
{
	var turnfraction = .0416;
	var movefraction = .1666;
	var turnamount = 0;
	var moveamount = 0;
	var handled = false;
	
	switch (this.whichKeyDown)
	{
    	case SB.Keyboard.KEY_LEFT : 
    		turnamount = +1 * turnfraction;
			handled = true;
    		break;
    	case SB.Keyboard.KEY_UP : 
    		moveamount = -1 * movefraction;
			handled = true;
    		break;
    	case SB.Keyboard.KEY_RIGHT : 
    		turnamount = -1 * turnfraction;
			handled = true;
    		break;
    	case SB.Keyboard.KEY_DOWN : 
    		moveamount = +1 * movefraction;
			handled = true;
    		break;
	}

	if (!handled)
	{
		switch (String.fromCharCode(this.whichKeyDown))
		{
	    	case 'A' :
	    		turnamount = +1 * turnfraction;
	    		handled = true;
	    		break;
	    		
	    	case 'W' :
	    		moveamount = -1 * movefraction;
	    		handled = true;
	    		break;
	    	case 'D' :
	    		turnamount = -1 * turnfraction;
				handled = true;
	    		break;
	    	case 'S' :
	    		moveamount = +1 * movefraction;
				handled = true;
	    		break;
	    		
	    	default : 
	    		break;
		}
	}

	if (moveamount)
	{
		this.moveDir.set(0, 0, moveamount);
		this.move(this.moveDir);
	}
	
	if (turnamount)
	{
		this.turnDir.set(0, turnamount, 0);
		this.turn(this.turnDir);
	}
}

SB.WalkthroughControllerScript.prototype.onTimeFractionChanged = function(fraction)
{
	this.turnFraction = fraction;
}

