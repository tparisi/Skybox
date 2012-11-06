/**
 * @fileoverview Tracker - converts x,y mouse motion into rotation about an axis (event-driven)
 * 
 * @author Tony Parisi
 */
goog.provide('SB.Tracker');
goog.require('SB.Component');

SB.Tracker = function(param)
{
	param = param || {};
	
    SB.Component.call(this, param);
    this.running = false;
}

goog.inherits(SB.Tracker, SB.Component);

SB.Tracker.prototype.realize = function()
{
    // Track our position based on the transform component and passed-in reference object
    this.object = this._entity.transform.object;
    this.reference = this.param.reference;
	this.referencePosition = this.param.referencePosition ? this.param.referencePosition : new THREE.Vector3();

	SB.Component.prototype.realize.call(this);

	if (this.running)
    {
    	this.position = this.calcPosition();
    }
    
}

SB.Tracker.prototype.start = function()
{
    this.running = true;

    if (this._realized)
    {
    	this.position = this.calcPosition();
    }
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
	// Get reference object position in world space
	var refmat = this.reference.object.matrixWorld;
	var refpos = this.referencePosition.clone();
	refpos = refmat.multiplyVector3(refpos);
	
	// Transform reference world space position into my model space
	var mymat = this.object.matrixWorld;
	var myinv = new THREE.Matrix4().getInverse(mymat);
	refpos = myinv.multiplyVector3(refpos);

	return refpos;
}