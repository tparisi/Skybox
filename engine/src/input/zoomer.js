/**
 * @fileoverview Zoomer - converts scalar input to x,y,z scale output
 * 
 * @author Tony Parisi
 */

goog.provide('SB.Zoomer');
goog.require('SB.Component');

SB.Zoomer = function(param)
{
    SB.Component.call(this);
    this.target = (param && param.target) ? param.target : null;
    this.scale = (param && param.scale) ? param.scale :{ x : 1, y : 1, z : 1 };
    this.oldScale = { x : this.scale.x, y : this.scale.y, z : this.scale.z };
}

goog.inherits(SB.Zoomer, SB.Component);
	        
SB.Zoomer.prototype.zoom = function(ds)
{
    this.scale.x *= ds;
    this.scale.y *= ds;
    this.scale.z *= ds;
}

SB.Zoomer.prototype.update = function()
{
    if (this.scale.x != this.oldScale.x || this.scale.y != this.oldScale.y || this.scale.z != this.oldScale.z)
    {
        this.publish("scale", this.scale.x, this.scale.y, this.scale.z);

        this.oldScale.x = this.scale.x;
        this.oldScale.y = this.scale.y;
        this.oldScale.z = this.scale.z;
    }
}
