goog.provide('SB.Viewer');
goog.require('SB.Entity');

SB.Viewer = function(param)
{
	SB.Entity.call(this, param);

	param = param || {};
	
	this.transform = new SB.Transform;
	this.addComponent(this.transform);
	this.transform.position.set(0, 0, 5);
	
	this.viewpoint = new SB.Entity;
	var transform = new SB.Transform;
	var camera = new SB.Camera;
	this.viewpoint.addComponent(transform);
	this.viewpoint.addComponent(camera);
	this.viewpoint.transform = transform;
	this.viewpoint.camera = camera;
	this.viewpoint.transform.position.set(0, 2.5, 3.67);

	this.addChild(this.viewpoint);

	if (param.headlight)
	{
		this.headlight = new SB.DirectionalLight({ color : 0xFFFFFF, intensity : 1});
		this.addComponent(this.headlight);
	}
	
	this.directionMatrix = new THREE.Matrix4;
	this.direction = new THREE.Vector3();
}

goog.inherits(SB.Viewer, SB.Entity);

SB.Viewer.prototype.realize = function() 
{
	SB.Entity.prototype.realize.call(this);
}

SB.Viewer.prototype.update = function() 
{
	SB.Entity.prototype.update.call(this);
	this.calcDirection();
}

SB.Viewer.prototype.move = function(dir)
{
	dir.multiplySelf(this.direction);
	this.transform.position.addSelf(dir);
}

SB.Viewer.prototype.turn = function(dir)
{
	this.transform.rotation.addSelf(dir);
}

SB.Viewer.prototype.calcDirection = function()
{
	this.directionMatrix.identity();
	this.directionMatrix.setRotationFromEuler(this.transform.rotation);
	this.direction.set(0, 0, 1);
	this.direction = this.directionMatrix.multiplyVector3(this.direction);
}

