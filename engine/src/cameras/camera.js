goog.provide('SB.Camera');
goog.require('SB.SceneComponent');

SB.Camera = function(param)
{
	param = param || {};
	
	SB.SceneComponent.call(this, param);
	this._active = param.active || false;
	this._fov = param.fov || 45;
}

goog.inherits(SB.Camera, SB.SceneComponent);

SB.Camera.prototype.realize = function() 
{
	SB.SceneComponent.prototype.realize.call(this);
	
	var container = SB.Graphics.instance.container;
	this.object = new THREE.PerspectiveCamera( this._fov, container.offsetWidth / container.offsetHeight, 1, 4000 );

	this.addToScene();
	
	if (this._active)
	{
		SB.Graphics.instance.camera = this.object;
	}
}

SB.Camera.prototype.setActive = function(active) 
{
	this._active = active;
	if (this._realized && this._active)
	{
		SB.Graphics.instance.camera = this.object;
	}
}

SB.Camera.prototype.lookAt = function(v) 
{
	this.object.lookAt(v);
}
