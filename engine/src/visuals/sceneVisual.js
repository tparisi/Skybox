/**
 * @fileoverview A visual containing a model in Collada format
 * @author Tony Parisi
 */
goog.provide('SB.SceneVisual');
goog.require('SB.Visual');

SB.SceneVisual = function(param) 
{
	param = param || {};
	
    SB.Visual.call(this, param);

    this.object = param.scene;
}

goog.inherits(SB.SceneVisual, SB.Visual);

SB.SceneVisual.prototype.realize = function()
{
	SB.Visual.prototype.realize.call(this);
	
    this.addToScene();
}
