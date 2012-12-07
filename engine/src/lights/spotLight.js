goog.provide('SB.SpotLight');
goog.require('SB.Light');

SB.SpotLight = function(param)
{
	param = param || {};
	this.direction = param.direction || new THREE.Vector3(0, 0, -1);
	this.distance = ( param.distance !== undefined ) ? param.distance : SB.SpotLight.DEFAULT_DISTANCE;
	this.angle = ( param.angle !== undefined ) ? param.angle : SB.SpotLight.DEFAULT_ANGLE;
	this.exponent = ( param.exponent !== undefined ) ? param.exponent : SB.SpotLight.DEFAULT_EXPONENT;
	this.castShadows = ( param.castShadows !== undefined ) ? param.castShadows : SB.SpotLight.DEFAULT_CAST_SHADOWS;
	this.shadowDarkness = ( param.shadowDarkness !== undefined ) ? param.shadowDarkness : SB.SpotLight.DEFAULT_SHADOW_DARKNESS;
	
	SB.Light.call(this, param);
}

goog.inherits(SB.SpotLight, SB.Light);

SB.SpotLight.prototype.realize = function() 
{
	this.object = new THREE.SpotLight(this.color, this.intensity, this.distance, this.angle, this.exponent);
	this.targetPos = this.position.clone();
	this.targetPos.addSelf(this.direction.multiplyScalar(SB.Light.DEFAULT_RANGE));	
	this.object.target.position.copy(this.targetPos);
	this.updateShadows();

	SB.Light.prototype.realize.call(this);
}

SB.SpotLight.prototype.update = function() 
{
	if (this.object)
	{
		// D'oh Three.js doesn't seem to transform light directions automatically
		// Really bizarre semantics
		this.targetPos.copy(this.position);
		this.targetPos.addSelf(this.direction.multiplyScalar(SB.Light.DEFAULT_RANGE));	
		this.object.target.position.copy(this.targetPos);
		
		var worldmat = this.object.parent.matrixWorld;
		worldmat.multiplyVector3(this.position);
		worldmat.multiplyVector3(this.object.target.position);
		
		// Copy other values
		this.object.distance = this.distance;
		this.object.angle = this.angle;
		this.object.exponent = this.exponent;

		this.updateShadows();
	}
	
	// Update the rest
	SB.Light.prototype.update.call(this);
}

SB.SpotLight.prototype.updateShadows = function()
{
	if (this.castShadows)
	{
		this.object.shadowCameraNear = 1;
		this.object.shadowCameraFar = SB.Light.DEFAULT_RANGE;
		this.object.shadowCameraFov = 90;

		// light.shadowCameraVisible = true;

		this.object.shadowBias = 0.0001;
		this.object.shadowDarkness = this.shadowDarkness;

		this.object.shadowMapWidth = 2048;
		this.object.shadowMapHeight = 2048;
		
		SB.Graphics.instance.enableShadows(true);
	}	
}

SB.SpotLight.DEFAULT_DISTANCE = 0;
SB.SpotLight.DEFAULT_ANGLE = Math.PI / 2;
SB.SpotLight.DEFAULT_EXPONENT = 10;
SB.SpotLight.DEFAULT_CAST_SHADOWS = false;
SB.SpotLight.DEFAULT_SHADOW_DARKNESS = 0.3;
