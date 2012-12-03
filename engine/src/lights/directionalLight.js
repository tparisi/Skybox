goog.provide('SB.DirectionalLight');
goog.require('SB.SceneComponent');

SB.DirectionalLight = function(param)
{
	param = param || {};
	this.color = param.color;
	this.intensity = param.intensity;
	SB.SceneComponent.call(this, param);
}

goog.inherits(SB.DirectionalLight, SB.SceneComponent);

SB.DirectionalLight.prototype.realize = function() 
{
	SB.SceneComponent.prototype.realize.call(this);
	this.object = new THREE.DirectionalLight(this.color, this.intensity, 0);
	this.position.set(0, 0, 1);
	this.object.target.position.set(0, 0, SB.DirectionalLight.DEFAULT_TARGET_Z);
	this.addToScene();
}

SB.DirectionalLight.prototype.update = function() 
{
	// D'oh Three.js doesn't seem to transform directional light directions automatically
	// Really bizarre semantics
	this.position.set(0, 0, 1);
	this.object.target.position.set(0, 0, SB.DirectionalLight.DEFAULT_TARGET_Z);
	var worldmat = this.object.parent.matrixWorld;
	worldmat.multiplyVector3(this.position);
	worldmat.multiplyVector3(this.object.target.position);
	SB.SceneComponent.prototype.update.call(this);
}

SB.DirectionalLight.DEFAULT_TARGET_Z = -10000;