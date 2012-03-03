goog.provide('SB.DirectionalLight');
goog.require('SB.SceneComponent');

SB.DirectionalLight = function(param)
{
	param = param || {};
	this.color = param.color;
	this.intensity = param.intensity;
	this.dirMatrix = new THREE.Matrix4;
	SB.SceneComponent.call(this, param);
}

goog.inherits(SB.DirectionalLight, SB.SceneComponent);

SB.DirectionalLight.prototype.realize = function() 
{
	SB.SceneComponent.prototype.realize.call(this);
	this.object = new THREE.DirectionalLight(0xffffff, 1, 1);
	this.position.set(0, 0, 1);
	this.addToScene();
}

SB.DirectionalLight.prototype.update = function() 
{
	// D'oh Three.js doesn't seem to transform directional light positions automatically
	this.position.set(0, 0, 1);
	this.dirMatrix.identity();
	this.dirMatrix.extractRotation(this.object.parent.matrixWorld);
	this.position = this.dirMatrix.multiplyVector3(this.position);
	SB.SceneComponent.prototype.update.call(this);
}
