/**
 * @fileoverview Tracker - converts x,y mouse motion into rotation about an axis (event-driven)
 * 
 * @author Tony Parisi
 */
goog.provide('SB.Tracker');
goog.require('SB.Component');

SB.Tracker = function(param)
{
	this.param = param || {};
	
    SB.Component.call(this);
    this.running = false;
}

goog.inherits(SB.Tracker, SB.Component);

SB.Tracker.prototype.realize = function()
{
    // Track our position based on the transform component and passed-in reference object
    this.object = this._entity.transform.object;
    this.reference = this.param.reference;
    	
	SB.Component.prototype.realize.call(this);
}

SB.Tracker.prototype.start = function()
{
	this.position = this.calcPosition();

    this.running = true;
}

SB.Tracker.prototype.stop = function(x, y)
{
    this.running = false;
}

SB.Tracker.prototype.update = function()
{	
    if (!this.running)
    {
        return;
    }

    var pos = this.calcPosition();
	if (this.position.x != pos.x ||
			this.position.y != pos.y ||
			this.position.z != pos.z)
	{
		//console.log("Object position: " + pos.x + ", " + pos.y + ", " + pos.z);

	    this.publish("position", pos);
	    this.position = pos;
	}
}

SB.Tracker.prototype.calcPosition = function()
{
	// Get reference object position world space
	var refpos = this.reference.position.clone();
	var refmat = this.reference.matrixWorld;
	refpos = refmat.multiplyVector3(refpos);
	
	// Transform reference world space position into my model space
	var mymat = this.object.matrixWorld;
	var myinv = THREE.Matrix4.makeInvert(mymat);
	refpos = myinv.multiplyVector3(refpos);

	return refpos;
}