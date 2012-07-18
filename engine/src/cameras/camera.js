goog.provide('SB.Camera');
goog.require('SB.SceneComponent');

SB.Camera = function(param)
{
	SB.SceneComponent.call(this, param);
}

goog.inherits(SB.Camera, SB.SceneComponent);

SB.Camera.prototype.realize = function() 
{
	SB.SceneComponent.prototype.realize.call(this);
	
	var container = SB.Graphics.instance.container;
	this.object = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 4000 );

	this.addToScene();
}

SB.Camera.prototype.bind = function() 
{
	SB.Graphics.instance.camera = this.object;
}

SB.Camera.prototype.lookAt = function(v) 
{
	this.object.lookAt(v);
}
