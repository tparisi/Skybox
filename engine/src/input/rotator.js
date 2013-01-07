/**
 * @fileoverview Rotator - converts x,y mouse motion into rotation about an axis (event-driven)
 * 
 * @author Tony Parisi
 */
goog.provide('SB.Rotator');
goog.require('SB.Component');

SB.Rotator = function(param)
{
    SB.Component.call(this);
    this.target = (param && param.target) ? param.target : null;
    this.axis = (param && param.axis) ? param.axis : 'y';
    this.lastx = SB.Mouse.NO_POSITION;
    this.lasty = SB.Mouse.NO_POSITION;
    this.x = SB.Mouse.NO_POSITION;
    this.y = SB.Mouse.NO_POSITION;
    this.running = false;
}

goog.inherits(SB.Rotator, SB.Component);
	        
SB.Rotator.prototype.start = function(x, y)
{
    this.lastx = x;
    this.lasty = y;
    this.x = this.lastx;
    this.y = this.lasty;
    this.running = true;
}

SB.Rotator.prototype.set = function(x, y)
{
    this.x = x;
    this.y = y;
}

SB.Rotator.prototype.stop = function(x, y)
{
    this.x = x;
    this.y = y;

    this.running = false;
}

SB.Rotator.prototype.update = function()
{
    if (!this.running)
    {
        return;
    }

    var dx = this.x - this.lastx;
    var dy = this.y - this.lasty;

    if (Math.abs(dx) < 4)
    	dx = 0;
    
    if (Math.abs(dy) < 4)
    	dy = 0;
    
    if (this.axis == 'y')
    {
    	this.publish("rotate", this.axis, dx * 0.01);
    }

    if (this.axis == 'x')
    {
    	this.publish("rotate", this.axis, dy * 0.01);
    }    

    this.lastx = this.x;
    this.lasty = this.y;
}
