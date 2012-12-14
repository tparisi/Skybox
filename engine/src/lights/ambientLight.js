goog.provide('SB.AmbientLight');
goog.require('SB.Light');

SB.AmbientLight = function(param)
{
	param = param || {};
	
	SB.Light.call(this, param);
}

goog.inherits(SB.AmbientLight, SB.Light);

SB.AmbientLight.prototype.realize = function() 
{
	this.object = new THREE.AmbientLight(this.color);

	SB.Light.prototype.realize.call(this);
}
