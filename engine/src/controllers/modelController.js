
goog.require('SB.Prefabs');

SB.Prefabs.ModelController = function(param)
{
	param = param || {};
	
	var controller = new SB.Entity(param);
	var transform = new SB.Transform;
	controller.addComponent(transform);
	var controllerScript = new SB.ModelControllerScript(param);
	controller.addComponent(controllerScript);

	var timer = new SB.Timer( { duration : 3333 } );
	controller.addComponent(timer);

	timer.subscribe("time", controllerScript, controllerScript.onTimeChanged);
	timer.subscribe("fraction", controllerScript, controllerScript.onTimeFractionChanged);	
	
	var viewpoint = new SB.Entity;
	var transform = new SB.Transform;
	var camera = new SB.PerspectiveCamera({active:param.active, fov: param.fov});
	camera.position.set(0, 0, 0);
	viewpoint.addComponent(transform);
	viewpoint.addComponent(camera);
	viewpoint.transform = transform;
	viewpoint.camera = camera;

	controller.addChild(viewpoint);

	/*
	var sphere = new SB.Entity;
	var transform = new SB.Transform;
	var visual = new SB.CubeVisual({width : .5, depth : .5, height : .5, color : 0x00ff00 });
	visual.position.set(0, 2, 0);
	sphere.addComponent(transform);
	sphere.addComponent(visual);

	controller.addChild(sphere);
	*/
	
	var intensity = param.headlight ? 1 : 0;
	
	var headlight = new SB.DirectionalLight({ intensity : intensity });
	controller.addComponent(headlight);
	
	return controller;
}

goog.provide('SB.ModelControllerScript');
goog.require('SB.Component');

SB.ModelControllerScript = function(param)
{
	SB.Component.call(this, param);

	this.radius = param.radius || SB.ModelControllerScript.default_radius;
	this.minRadius = param.minRadius || SB.ModelControllerScript.default_min_radius;
	this.enabled = (param.enabled !== undefined) ? param.enabled : true;
}

goog.inherits(SB.ModelControllerScript, SB.Component);

SB.ModelControllerScript.prototype.realize = function()
{
	this.dragger = this._entity.getComponent(SB.Dragger);
	this.timer = this._entity.getComponent(SB.Timer);
	this.headlight = this._entity.getComponent(SB.DirectionalLight);
	this.viewpoint = this._entity.getChild(0);
	this.camera = this.viewpoint.camera;
	
	// var sphere = this._entity.getChild(1);
	// this.sphere = sphere.getComponent(SB.Visual);
	
	this.camera.position.set(0, 0, this.radius);
	
	this.controls = null;
	
	SB.Game.instance.mouseDelegate = this;
	SB.Game.instance.keyboardDelegate = this;
}

SB.ModelControllerScript.prototype.createControls = function()
{
	this.camera.object.position = this.camera.position;
	this.camera.object.rotation = this.camera.rotation;
	
	this.controls = new SB.OrbitControls(this.camera.object, SB.Graphics.instance.container);
}

SB.ModelControllerScript.prototype.update = function()
{
	if (!this.controls)
	{
		this.createControls();
		this.controls.enabled = this.enabled;
		this.controls.userMinY = this.minY;
	}
	
	this.camera.object.position = this.camera.position;
	this.camera.object.rotation = this.camera.rotation;
	
	this.controls.update();
	this.camera.position = this.camera.object.position;
	this.camera.rotation = this.camera.object.rotation;
}

SB.ModelControllerScript.prototype.onMouseMove = function(x, y)
{
	if (this.active && this.dragging)
	{
	}
}

SB.ModelControllerScript.prototype.onMouseDown = function(x, y)
{
	if (this.active)
	{
		this.dragging = true;		
	}
}

SB.ModelControllerScript.prototype.onMouseUp = function(x, y)
{
	if (this.active && this.dragging)
	{
		this.dragging = false;
		this.lastdx = 0;
		this.lastdy = 0;
	}
}

SB.ModelControllerScript.prototype.onMouseScroll = function(delta)
{
}

SB.ModelControllerScript.prototype.onKeyDown = function(keyCode, charCode)
{
	this.whichKeyDown = keyCode;
	
	this.timer.start();
}

SB.ModelControllerScript.prototype.onKeyUp = function(keyCode, charCode)
{
	this.lastdx = 0;
	this.whichKeyDown = 0;
	this.turnFraction = 0;
	
	this.timer.stop();
}

SB.ModelControllerScript.prototype.onKeyPress = function(keyCode, charCode)
{
}

SB.ModelControllerScript.prototype.onTimeChanged = function(t)
{
	var yFraction = .333;
	var xFraction = .333;
	var yRotateAmount = 0;
	var xRotateAmount = 0;
	var handled = false;
	
	switch (this.whichKeyDown)
	{
    	case SB.Keyboard.KEY_LEFT : 
    		yRotateAmount = -1 * yFraction * this.rotateSpeed;
			handled = true;
    		break;
    	case SB.Keyboard.KEY_UP : 
    		xRotateAmount = -1 * xFraction * this.rotateSpeed;
			handled = true;
    		break;
    	case SB.Keyboard.KEY_RIGHT : 
    		yRotateAmount = +1 * yFraction * this.rotateSpeed;
			handled = true;
    		break;
    	case SB.Keyboard.KEY_DOWN : 
    		xRotateAmount = +1 * xFraction * this.rotateSpeed;
			handled = true;
    		break;
	}

	if (yRotateAmount)
	{
		// this.rotateY(yRotateAmount);
	}
	
	if (xRotateAmount)
	{
		// this.rotateX(xRotateAmount);
	}
}

SB.ModelControllerScript.prototype.onTimeFractionChanged = function(fraction)
{
	this.turnFraction = fraction;
}

SB.ModelControllerScript.default_radius = 5;
SB.ModelControllerScript.default_min_radius = 1;
SB.ModelControllerScript.MAX_X_ROTATION = 0; // Math.PI / 12;
SB.ModelControllerScript.MIN_X_ROTATION = -Math.PI / 2;
SB.ModelControllerScript.MAX_Y_ROTATION = Math.PI * 2;
SB.ModelControllerScript.MIN_Y_ROTATION = -Math.PI * 2;
