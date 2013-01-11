
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

	var sphere = new SB.Entity;
	var transform = new SB.Transform;
	var visual = new SB.CubeVisual({width : .5, depth : .5, height : .5, color : 0x00ff00 });
	visual.position.set(0, 2, 0);
	sphere.addComponent(transform);
	sphere.addComponent(visual);

	controller.addChild(sphere);
	
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

	this.lastdx = 0;
	this.lastdy = 0;
	this.dragging = false;
	this.rotateSpeed = 1;
	this.active = (param.active !== undefined) ? param.active : true;
		
	this.cameraPos = new THREE.Vector3();
	this.cameraUp = new THREE.Vector3(0, 1, 0);
	this.targetPos = new THREE.Vector3();
	this.rotateStart = new THREE.Vector3();
	this.rotateEnd = new THREE.Vector3();
	var lastPosition = new THREE.Vector3();
	
	this.radius = param.radius || SB.ModelControllerScript.default_radius;
	this.minRadius = param.minRadius || SB.ModelControllerScript.default_min_radius;
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
	this.camera = this.viewpoint.camera;
	
	var sphere = this._entity.getChild(1);
	this.sphere = sphere.getComponent(SB.Visual);
	
	this.cameraPos.copy(this.camera.position.set(0, 0, this.radius));
	
	SB.Game.instance.mouseDelegate = this;
	SB.Game.instance.keyboardDelegate = this;
}

SB.ModelControllerScript.prototype.zoom = function(delta)
{
	this.radius += delta;
	if (this.radius < this.minRadius)
		this.radius = this.minRadius;
	
}

SB.ModelControllerScript.prototype.update = function()
{
	TWEEN.update();	

	if (true)
	{
		this.cameraPos.copy( this.camera.position ).subSelf( this.targetPos );
		this.cameraPos.normalize().multiplyScalar(this.radius);
	
		if (this.dragging)
		{
			this.rotateCamera();
		}
	
		/*
		if ( !_this.noZoom ) {
	
			_this.zoomCamera();
	
		}
	
		if ( !_this.noPan ) {
	
			_this.panCamera();
	
		}
		*/
		
		this.camera.position.add( this.targetPos, this.cameraPos );
	
		// _this.checkDistances();
	
		this.camera.object.position.copy( this.camera.position );
		this.camera.object.lookAt( this.targetPos );
		this.camera.rotation = this.camera.object.rotation;
		
		/*
		if ( lastPosition.distanceToSquared( _this.object.position ) > 0 ) {
	
			_this.dispatchEvent( changeEvent );
	
			lastPosition.copy( _this.object.position );
	
		}
		*/
	}
	
}

SB.ModelControllerScript.prototype.rotateCamera = function()
{
	if (!this.rotateStart.isZero() && !this.rotateEnd.isZero())
	{
		var angle = Math.acos( this.rotateStart.dot( this.rotateEnd ) );
	
		if ( angle ) {
	
			var axis = ( new THREE.Vector3() ).cross( this.rotateStart, this.rotateEnd ),
				quaternion = new THREE.Quaternion();
	
			if (!axis.isZero())
			{
				angle *= this.rotateSpeed;
		
				quaternion.setFromAxisAngle( axis, -angle );
		
				quaternion.multiplyVector3(this.cameraPos);
				quaternion.multiplyVector3(this.cameraUp );
		
		//		quaternion.multiplyVector3( this.rotateEnd );
		
		//		quaternion.setFromAxisAngle( axis, angle * ( _this.dynamicDampingFactor - 1.0 ) );
		//		quaternion.multiplyVector3( this.rotateStart );
			}
	
		}
	}

}

SB.ModelControllerScript.prototype.clientToViewport = function(c, vp)
{
	var container = SB.Graphics.instance.container;
	
	vp.x = ( c.x / container.offsetWidth ) * 2 - 1;
	vp.y = - ( c.y / container.offsetHeight ) * 2 + 1;
}

SB.ModelControllerScript.prototype.getMousePointOnSphere = function(x, y)
{
	var vp = {};
	
	this.clientToViewport({ x : x, y : y} , vp)

	var mouseOnBall = new THREE.Vector3(
			vp.x,
			vp.y,
			0.0
		);

	var length = mouseOnBall.length();

	if ( length > 1.0 ) {

		mouseOnBall.normalize();

	} else {

		mouseOnBall.z = Math.sqrt( 1.0 - length * length );

	}

	this.cameraPos.copy( this.camera.position ).subSelf( this.targetPos );

	var projection = this.cameraUp.clone().setLength( mouseOnBall.y );
	projection.addSelf( this.cameraUp.clone().crossSelf( this.cameraPos ).setLength( mouseOnBall.x ) );
	projection.addSelf( this.cameraPos.setLength( mouseOnBall.z ) );
	//projection.multiplyScalar(this.radius);
	
	return projection;
}

SB.ModelControllerScript.prototype.onMouseMove = function(x, y)
{
	if (this.active && this.dragging)
	{
		var mouseOnSphere = this.getMousePointOnSphere(x, y);
		this.rotateEnd.copy(mouseOnSphere);
		
		/*
		new TWEEN.Tween(this.rotateEnd)
	    .to( {
	    	x : rotateEnd.x,
	    	y : rotateEnd.y,
	    	z : rotateEnd.z
	    }, 667)
	    .easing(TWEEN.Easing.Quadratic.EaseIn)
	    .easing(TWEEN.Easing.Quadratic.EaseOut).start();	
		*/
		
			//this.sphere.position.copy(this.rotateEnd);
	}
}

SB.ModelControllerScript.prototype.onMouseDown = function(x, y)
{
	if (this.active)
	{
		this.dragging = true;
		
		var mouseOnSphere = this.getMousePointOnSphere(x, y);
		this.rotateStart.copy(mouseOnSphere);
		this.rotateEnd.copy(mouseOnSphere);
		//this.sphere.position.copy(this.rotateStart);
	}
}

SB.ModelControllerScript.prototype.onMouseUp = function(x, y)
{
	if (this.active && this.dragging)
	{
		this.dragging = false;
		this.lastdx = 0;
		this.lastdy = 0;

		var mouseOnSphere = this.getMousePointOnSphere(x, y);
		this.rotateStart.copy(mouseOnSphere);
		this.rotateEnd.copy(mouseOnSphere);

		//this.sphere.position.copy(this.rotateEnd);
	}
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
