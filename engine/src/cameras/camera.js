goog.provide('SB.Camera');
goog.require('SB.SceneComponent');

SB.Camera = function(param)
{
	param = param || {};
	
	SB.SceneComponent.call(this, param);

	this.active = param.active || false;
	var position = param.position || SB.Camera.DEFAULT_POSITION;
    this.position.copy(position);	
}

goog.inherits(SB.Camera, SB.SceneComponent);

SB.Camera.prototype.realize = function() 
{
	SB.SceneComponent.prototype.realize.call(this);
	
	this.addToScene();
	
	if (this.active)
	{
		SB.Graphics.instance.camera = this.object;
	}
}

SB.Camera.prototype.setActive = function(active) 
{
	this.active = active;
	if (this._realized && this.active)
	{
		SB.Graphics.instance.camera = this.object;
	}
}

SB.Camera.prototype.lookAt = function(v) 
{
	this.object.lookAt(v);
}

SB.Camera.DEFAULT_POSITION = new THREE.Vector3(0, 0, 10);