/**
 * @fileoverview ScreenTracker - converts x,y mouse motion into rotation about an axis (event-driven)
 * 
 * @author Tony Parisi
 */
goog.provide('SB.ScreenTracker');
goog.require('SB.Component');

SB.ScreenTracker = function(param)
{
	this.param = param || {};
	this.referencePosition = param.referencePosition ? param.referencePosition : new THREE.Vector3();
	
    SB.Component.call(this);
    this.running = false;
}

goog.inherits(SB.ScreenTracker, SB.Component);

SB.ScreenTracker.prototype.realize = function()
{
    // Track our position based on the transform component and camera matrix
    this.object = this._entity.transform.object;
    var instance = SB.Graphics.instance;
	this.camera = instance.camera;
	this.projector = instance.projector;
	this.container = instance.container;
	this.renderer = instance.renderer;

    SB.Component.prototype.realize.call(this);
}

SB.ScreenTracker.prototype.start = function()
{
	this.position = this.calcPosition();
    this.running = true;
}

SB.ScreenTracker.prototype.stop = function(x, y)
{
    this.running = false;
}

SB.ScreenTracker.prototype.update = function()
{
	this.camera = SB.Graphics.instance.camera;
	
    if (!this.running)
    {
        return;
    }

    var pos = this.calcPosition();
	if (this.position.x != pos.x ||
			this.position.y != pos.y ||
			this.position.z != pos.z)
	{
	    this.publish("position", pos);
	    this.position = pos;
	}
}

SB.ScreenTracker.prototype.calcPosition = function()
{
	// Get object position in screen space
	var mat = this.object.matrixWorld;
	var pos = this.referencePosition.clone();
	pos.applyMatrix4(mat);
	
	var projected = pos.clone();
	this.projector.projectVector(projected, this.camera);
	
	var eltx = (1 + projected.x) * this.container.offsetWidth / 2 ;
	var elty = (1 - projected.y) * this.container.offsetHeight / 2;

	var offset = $(this.renderer.domElement).offset();	
	eltx += offset.left;
	elty += offset.top;

	var cameramat = this.camera.matrixWorldInverse;
	var cameraspacepos = pos.clone().applyMatrix4(cameramat);
	
	return new THREE.Vector3(eltx, elty, -cameraspacepos.z);
}
