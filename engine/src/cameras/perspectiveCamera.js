goog.provide('SB.PerspectiveCamera');
goog.require('SB.Camera');

SB.PerspectiveCamera = function(param)
{
	param = param || {};	
	this.fov = param.fov || 45;
	
	SB.Camera.call(this, param);
}

goog.inherits(SB.PerspectiveCamera, SB.Camera);

SB.PerspectiveCamera.prototype.realize = function() 
{
	var container = SB.Graphics.instance.container;
	this.object = new THREE.PerspectiveCamera( this.fov, container.offsetWidth / container.offsetHeight, 1, 4000 );

	SB.Camera.prototype.realize.call(this);	
}
