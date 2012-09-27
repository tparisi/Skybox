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
	var camera = new SB.Camera({active:true});
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
}

goog.inherits(SB.Viewer, SB.Entity);

SB.Viewer.prototype.realize = function() 
{
	SB.Entity.prototype.realize.call(this);
}

SB.Viewer.prototype.update = function() 
{
	SB.Entity.prototype.update.call(this);
}

SB.Viewer.prototype.move = function(dir)
{
	this.directionMatrix.identity();
	this.directionMatrix.setRotationFromEuler(this.transform.rotation);
	dir = this.directionMatrix.multiplyVector3(dir);
	this.transform.position.addSelf(dir);
}

SB.Viewer.prototype.turn = function(dir)
{
	this.transform.rotation.addSelf(dir);
}
