goog.provide('SB.LightComponent');
goog.require('SB.SceneComponent');

SB.LightComponent = function(param)
{
	SB.SceneComponent.call(this, param);
}

goog.inherits(SB.LightComponent, SB.SceneComponent);

SB.LightComponent.prototype.realize = function()
{
	SB.SceneComponent.prototype.realize.call(this);
	
	this.object = new THREE.DirectionalLight(0xffffff);
    this.object.position.set(1, 0, 0).normalize();
	
	this.addToScene();
}
