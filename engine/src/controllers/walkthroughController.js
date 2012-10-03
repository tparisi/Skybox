
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
	controller.addComponent(dragger);
	controller.addComponent(rotator);
		
	var viewpoint = new SB.Entity;
	var transform = new SB.Transform;
	var camera = new SB.Camera({active:true});
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
	this.lastdy = 0;
	this.dragging = false;
}

goog.inherits(SB.WalkthroughControllerScript, SB.Component);

SB.WalkthroughControllerScript.prototype.realize = function()
{
	var dragger = this._entity.getComponent(SB.Dragger);
	var rotator = this._entity.getComponent(SB.Rotator);
	
	dragger.subscribe("move", this, this.onDraggerMove);
	rotator.subscribe("rotate", this, this.onRotatorRotate);
	
	this.dragger = dragger;
	this.rotator = rotator;
	
	SB.Game.instance.mouseDelegate = this;
	SB.Game.instance.keyboardDelegate = this;
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
	SB.Graphics.instance.camera.position.z -= delta;
}

SB.WalkthroughControllerScript.prototype.onRotatorRotate = function(axis, delta)
{
	delta *= .666;
	
	if (delta != 0)
	{
		// this.controllerScript.transform.rotation.y -= delta;
		var dir = new THREE.Vector3(0, -delta, 0);
		this.turn(dir);
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
		var dir = new THREE.Vector3(0, 0, -dy);
		this.move(dir);
	}
}

