
goog.require('SB.Prefabs');

SB.Prefabs.WalkthroughController = function(param)
{
	var controller = new SB.Entity(param);
	var transform = new SB.Transform;
	controller.addComponent(transform);
	controller.transform.position.set(0, 0, 5);
	var controllerScript = new SB.WalkthroughControllerScript;
	controller.addComponent(controllerScript);
	
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
}

goog.inherits(SB.WalkthroughControllerScript, SB.Component);

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

