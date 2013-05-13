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
	this.referencePosition = this.param.referencePosition ? this.param.referencePosition.clone() : new THREE.Vector3();
	this.refpos = new THREE.Vector3;
	this.position = new THREE.Vector3;
	this.orientation = new THREE.Quaternion;
	this.savedPosition = new THREE.Vector3;
	this.savedOrientation = new THREE.Quaternion;
	this.reference2me = new THREE.Matrix4;
	this.world2me = new THREE.Matrix4;
	
	SB.Component.prototype.realize.call(this);
}

SB.Tracker.prototype.start = function()
{
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

    this.calcPosition();
	if (this.position.x != this.savedPosition.x ||
			this.position.y != this.savedPosition.y ||
			this.position.z != this.savedPosition.z)
	{
		//console.log("Object position: " + pos.x + ", " + pos.y + ", " + pos.z);

	    this.publish("position", this.position);
	}
	
	this.calcOrientation();
	if (this.orientation.x != this.savedOrientation.x ||
			this.orientation.y != this.savedOrientation.y ||
			this.orientation.z != this.savedOrientation.z ||
			this.orientation.w != this.savedOrientation.w )
	{
		//console.log("Object position: " + pos.x + ", " + pos.y + ", " + pos.z);

	    this.publish("orientation", this.orientation);
	}
}

SB.Tracker.prototype.calcPosition = function()
{
	// Get reference object position in world space
	var refmat = this.reference.object.matrixWorld;
	this.refpos.copy(this.referencePosition);
	this.refpos.applyMatrix4(refmat);
	
	// Transform reference world space position into my model space
	var mymat = this.object.matrixWorld;
	this.world2me.getInverse(mymat);
	this.position = this.refpos.clone().applyMatrix4(this.world2me);
}

SB.Tracker.prototype.calcOrientation = function()
{
	// Get reference object orientation in world space
	var refmat = this.reference.object.matrixWorld;
	var mymat = this.object.matrixWorld;
	this.world2me.getInverse(mymat);
	this.reference2me.multiply(refmat, this.world2me);
	this.orientation = this.reference2me.decompose()[1];
}