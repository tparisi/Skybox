
goog.require('SB.Prefabs');

SB.Prefabs.ModelController = function(param)
{
	param = param || {};
	
	var controller = new SB.Entity(param);
	var transform = new SB.Transform;
	controller.addComponent(transform);
	var controllerScript = new SB.ModelControllerScript(param);
	controller.addComponent(controllerScript);

	var xRotator = new SB.Rotator( { axis : 'x' } );
	var yRotator = new SB.Rotator( { axis : 'y' } );
	var timer = new SB.Timer( { duration : 3333 } );
	
	controller.addComponent(xRotator);
	controller.addComponent(yRotator);
	controller.addComponent(timer);

	xRotator.subscribe("rotate", controllerScript, controllerScript.onXRotatorRotate);
	yRotator.subscribe("rotate", controllerScript, controllerScript.onYRotatorRotate);
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

	this.rotationMatrix = new THREE.Matrix4;
	this.cameraPos = new THREE.Vector3;
	this.object2camera = new THREE.Vector3(0, 0, 1);
	this.combinedRotation = new THREE.Vector3;
	
	this.lastdx = 0;
	this.lastdy = 0;
	this.dragging = false;
	this.rotateSpeed = 1;

	this.radius = param.radius || SB.ModelControllerScript.default_radius;
	this.xRotation = 0;
	this.yRotation = 0;
	
	this.maxXRotation = param.maxXRotation || SB.ModelControllerScript.MAX_X_ROTATION;
	this.minXRotation = param.minXRotation || SB.ModelControllerScript.MIN_X_ROTATION;
	this.maxYRotation = param.maxYRotation || SB.ModelControllerScript.MAX_Y_ROTATION;
	this.minYRotation = param.minYRotation || SB.ModelControllerScript.MIN_Y_ROTATION;
}

goog.inherits(SB.ModelControllerScript, SB.Component);

SB.ModelControllerScript.prototype.realize = function()
{
	this.dragger = this._entity.getComponent(SB.Dragger);
	this.xRotator = this._entity.getComponents(SB.Rotator)[0];
	this.yRotator = this._entity.getComponents(SB.Rotator)[1];
	this.timer = this._entity.getComponent(SB.Timer);
	this.headlight = this._entity.getComponent(SB.DirectionalLight);
	this.viewpoint = this._entity.getChild(0);
	
	this.viewpoint.transform.position.set(0, 0, this.radius);
	
	SB.Game.instance.mouseDelegate = this;
	SB.Game.instance.keyboardDelegate = this;
}

SB.ModelControllerScript.prototype.zoom = function(delta)
{
	this.radius += delta;
}

if (true)
{
SB.ModelControllerScript.prototype.rotateX = function(delta)
{
	var newXRotation = this.xRotation - delta;
	
	if (newXRotation > this.maxXRotation)
		newXRotation =  this.maxXRotation;
	
	if (newXRotation < this.minXRotation)
		newXRotation = this.minXRotation;
			
	if (newXRotation >= Math.PI * 2)
	{
		newXRotation = 0;
		this.xRotation = 0;
	}
	
	if (newXRotation <= -Math.PI * 2)
	{
		newXRotation = 0;
		this.xRotation = 0;
	}
	
	new TWEEN.Tween(this)
    .to( {
        xRotation : newXRotation
    }, 667)
    .easing(TWEEN.Easing.Quadratic.EaseIn)
    .easing(TWEEN.Easing.Quadratic.EaseOut).start();	
}

SB.ModelControllerScript.prototype.rotateY = function(delta)
{
	var newYRotation = this.yRotation - delta;
	
	if (newYRotation > this.maxYRotation)
		newYRotation =  this.maxYRotation;
	
	if (newYRotation < this.minYRotation)
		newYRotation = this.minYRotation;
	
	if (newYRotation >= Math.PI * 2)
	{
		newYRotation = 0;
		this.yRotation = 0;
	}
	
	if (newYRotation <= -Math.PI * 2)
	{
		newYRotation = 0;
		this.yRotation = 0;
	}
	
	new TWEEN.Tween(this)
    .to( {
        yRotation : newYRotation
    }, 667)
    .easing(TWEEN.Easing.Quadratic.EaseIn)
    .easing(TWEEN.Easing.Quadratic.EaseOut).start();	
}

SB.ModelControllerScript.prototype.update = function()
{
	TWEEN.update();
	
	this.object2camera.set(0, 0, 1);
	this.combinedRotation.set(this.xRotation, this.yRotation, 0);
	this.rotationMatrix.setRotationFromEuler(this.combinedRotation);
	this.rotationMatrix.multiplyVector3(this.object2camera);
	this.object2camera.multiplyScalar(this.radius);
	
	this.cameraPos.copy(this.object2camera);

	this.viewpoint.transform.position.copy(this.cameraPos);
	this.viewpoint.transform.rotation.copy(this.combinedRotation);
}
}

else {
SB.ModelControllerScript.prototype.rotateX = function(delta)
{
	var newXRotation = this.xRotation - delta;
	
	if (newXRotation > this.maxXRotation)
		newXRotation =  this.maxXRotation;
	
	if (newXRotation < this.minXRotation)
		newXRotation = this.minXRotation;
			
	if (newXRotation >= Math.PI * 2)
	{
		newXRotation = 0;
		this.xRotation = 0;
	}
	
	if (newXRotation <= -Math.PI * 2)
	{
		newXRotation = 0;
		this.xRotation = 0;
	}
	
	new TWEEN.Tween(this)
    .to( {
        xRotation : newXRotation
    }, 667)
    .easing(TWEEN.Easing.Quadratic.EaseIn)
    .easing(TWEEN.Easing.Quadratic.EaseOut).start();	
}

SB.ModelControllerScript.prototype.rotateY = function(delta)
{
	var newYRotation = this.yRotation - delta;
	
	if (newYRotation > this.maxYRotation)
		newYRotation =  this.maxYRotation;
	
	if (newYRotation < this.minYRotation)
		newYRotation = this.minYRotation;
	
	if (newYRotation >= Math.PI * 2)
	{
		newYRotation = 0;
		this.yRotation = 0;
	}
	
	if (newYRotation <= -Math.PI * 2)
	{
		newYRotation = 0;
		this.yRotation = 0;
	}
	
	new TWEEN.Tween(this)
    .to( {
        yRotation : newYRotation
    }, 667)
    .easing(TWEEN.Easing.Quadratic.EaseIn)
    .easing(TWEEN.Easing.Quadratic.EaseOut).start();	
}

SB.ModelControllerScript.prototype.update = function()
{
	TWEEN.update();
	
	this.object2camera.set(0, 0, 1);
	this.combinedRotation.set(this.xRotation, this.yRotation, 0);
	this.rotationMatrix.setRotationFromEuler(this.combinedRotation);
	this.rotationMatrix.multiplyVector3(this.object2camera);
	this.object2camera.multiplyScalar(this.radius);
	
	this.cameraPos.copy(this.object2camera);

	this.viewpoint.transform.position.copy(this.cameraPos);
	this.viewpoint.transform.rotation.copy(this.combinedRotation);
}
}

SB.ModelControllerScript.prototype.onMouseMove = function(x, y)
{
	this.xRotator.set(x, y);
	this.yRotator.set(x, y);
}

SB.ModelControllerScript.prototype.onMouseDown = function(x, y)
{
	this.xRotator.start(x, y);
	this.yRotator.start(x, y);
	this.dragging = true;
}

SB.ModelControllerScript.prototype.onMouseUp = function(x, y)
{
	this.xRotator.stop(x, y);
	this.yRotator.stop(x, y);
	this.dragging = false;
	this.lastdx = 0;
	this.lastdy = 0;
}

SB.ModelControllerScript.prototype.onMouseScroll = function(delta)
{
	this.zoom(-delta);
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

SB.ModelControllerScript.prototype.onXRotatorRotate = function(axis, delta)
{
//	console.log("Rotator delta = ", delta);

	delta *= 1;
	
	if (delta != 0)
	{
		this.rotateX(delta);
		this.lastdy = delta;
	}
	else if (false) // this.lastdy)
	{
		this.rotateX(this.lastdy);
	}
}

SB.ModelControllerScript.prototype.onYRotatorRotate = function(axis, delta)
{
//	console.log("Rotator delta = ", delta);

	delta *= 2;
	
	if (delta != 0)
	{
		this.rotateY(delta);
		this.lastdy = delta;
	}
	else if (false) // this.lastdy)
	{
		this.rotateY(this.lastdy);
	}
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
		this.rotateY(yRotateAmount);
	}
	
	if (xRotateAmount)
	{
		this.rotateX(xRotateAmount);
	}
}

SB.ModelControllerScript.prototype.onTimeFractionChanged = function(fraction)
{
	this.turnFraction = fraction;
}

SB.ModelControllerScript.default_radius = 5;
SB.ModelControllerScript.MAX_X_ROTATION = Math.PI / 12;
SB.ModelControllerScript.MIN_X_ROTATION = -Math.PI / 4;
SB.ModelControllerScript.MAX_Y_ROTATION = Math.PI * 2;
SB.ModelControllerScript.MIN_Y_ROTATION = -Math.PI * 2;
