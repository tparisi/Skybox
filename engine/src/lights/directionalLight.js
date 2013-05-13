goog.provide('SB.DirectionalLight');
goog.require('SB.Light');

SB.DirectionalLight = function(param)
{
	param = param || {};
	this.direction = param.direction || new THREE.Vector3(0, 0, -1);
	
	SB.Light.call(this, param);
}

goog.inherits(SB.DirectionalLight, SB.Light);

SB.DirectionalLight.prototype.realize = function() 
{
	this.object = new THREE.DirectionalLight(this.color, this.intensity, 0);
	this.position.copy(this.direction).negate().multiplyScalar(SB.Light.DEFAULT_RANGE);
	this.object.target.position.copy(this.direction).multiplyScalar(SB.Light.DEFAULT_RANGE);

	SB.Light.prototype.realize.call(this);
}

SB.DirectionalLight.prototype.update = function() 
{
	// D'oh Three.js doesn't seem to transform directional light directions automatically
	// Really bizarre semantics
	this.position.copy(this.direction).negate();
	this.object.target.position.copy(this.direction).multiplyScalar(SB.Light.DEFAULT_RANGE);
	var worldmat = this.object.parent.matrixWorld;
	this.position.applyMatrix4(worldmat);
	this.object.target.position.applyMatrix4(worldmat);
	SB.Light.prototype.update.call(this);
}

