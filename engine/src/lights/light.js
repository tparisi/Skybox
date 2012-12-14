goog.provide('SB.Light');
goog.require('SB.SceneComponent');

SB.Light = function(param)
{
	param = param || {};
	this.color = ( param.color !== undefined ) ? param.color : SB.Light.DEFAULT_COLOR;
	this.intensity = ( param.intensity !== undefined ) ? param.intensity : SB.Light.DEFAULT_INTENSITY;
	SB.SceneComponent.call(this, param);
}

goog.inherits(SB.Light, SB.SceneComponent);

SB.Light.prototype.realize = function() 
{
	SB.SceneComponent.prototype.realize.call(this);

	if (this.object)
	{
		this.addToScene();
	}
}

SB.Light.prototype.update = function() 
{
	if (this.object)
	{
		this.object.color.setHex(this.color);
		this.object.intensity = this.intensity;
	}
	
	SB.SceneComponent.prototype.update.call(this);
}

SB.Light.DEFAULT_COLOR = 0xFFFFFF;
SB.Light.DEFAULT_INTENSITY = 1;
SB.Light.DEFAULT_RANGE = 10000;