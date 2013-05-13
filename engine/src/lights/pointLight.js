goog.provide('SB.PointLight');
goog.require('SB.Light');

SB.PointLight = function(param)
{
	param = param || {};
	this.distance = ( param.distance !== undefined ) ? param.distance : SB.PointLight.DEFAULT_DISTANCE;
	
	SB.Light.call(this, param);
}

goog.inherits(SB.PointLight, SB.Light);

SB.PointLight.prototype.realize = function() 
{
	this.object = new THREE.PointLight(this.color, this.intensity, this.distance);

	SB.Light.prototype.realize.call(this);
}

SB.PointLight.prototype.update = function() 
{
	if (this.object)
	{
		var worldmat = this.object.parent.matrixWorld;
		this.position.applyMatrix4(worldmat);
		
		// Copy other values
		this.object.distance = this.distance;
	}
	
	// Update the rest
	SB.Light.prototype.update.call(this);
}

SB.PointLight.DEFAULT_DISTANCE = 0;
