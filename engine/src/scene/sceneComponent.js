/**
 * @fileoverview Base class for visual elements.
 * @author Tony Parisi
 */
goog.provide('SB.SceneComponent');
goog.require('SB.Component');

/**
 * @constructor
 */
SB.SceneComponent = function(param)
{	
	SB.Component.call(this, param);
    
    this.object = null;
    this.position = this.param.position || new THREE.Vector3();
    this.rotation = this.param.rotation || new THREE.Vector3();
    this.scale = this.param.scale || new THREE.Vector3(1, 1, 1);
    this.autoUpdateTransform = true;
} ;

goog.inherits(SB.SceneComponent, SB.Component);

SB.SceneComponent.prototype.realize = function()
{
	if (this.object && !this.object.data)
	{
		this.addToScene();
	}
	
	SB.Component.prototype.realize.call(this);
}

SB.SceneComponent.prototype.update = function()
{	
	SB.Component.prototype.update.call(this);
	
	if (this.object && this.autoUpdateTransform)
	{
		this.object.position.x = this.position.x;
		this.object.position.y = this.position.y;
		this.object.position.z = this.position.z;
		this.object.rotation.x = this.rotation.x;
		this.object.rotation.y = this.rotation.y;
		this.object.rotation.z = this.rotation.z;
		this.object.scale.x = this.scale.x;
		this.object.scale.y = this.scale.y;
		this.object.scale.z = this.scale.z;
	}
	else
	{
		var debug = 1;
	}
}

SB.SceneComponent.prototype.addToScene = function() {
	if (this._entity)
	{
		var parent = this._entity.transform ? this._entity.transform.object : SB.Graphics.instance.scene;
		if (parent)
		{
		    parent.add(this.object);
		    this.object.data = this; // backpointer for picking and such
		}
		else
		{
			// N.B.: throw something?
		}
	}
	else
	{
		// N.B.: throw something?
	}
}

SB.SceneComponent.prototype.removeFromScene = function() {
	if (this._entity)
	{
		var parent = this._entity.transform ? this._entity.transform.object : SB.Graphics.instance.scene;
		if (parent)
		{
			this.object.data = null;
		    parent.remove(this.object);
		}
		else
		{
			// N.B.: throw something?
		}
	}
	else
	{
		// N.B.: throw something?
	}
}
