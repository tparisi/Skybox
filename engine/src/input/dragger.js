/**
 * @fileoverview Dragger - converts x,y mouse motion into x, y object position output
 * 
 * @author Tony Parisi
 */
goog.provide('SB.Dragger');
goog.require('SB.Component');

SB.Dragger = function(param)
{
    SB.Component.call(this);
    this.target = (param && param.target) ? param.target : null;
    this.lastx = SB.Mouse.NO_POSITION;
    this.lasty = SB.Mouse.NO_POSITION;
    this.x = SB.Mouse.NO_POSITION;
    this.y = SB.Mouse.NO_POSITION;
    this.running = false;
}

goog.inherits(SB.Dragger, SB.Component);

SB.Dragger.prototype.start = function(x, y)
{
    this.lastx = x;
    this.lasty = y;
    this.x = this.lastx;
    this.y = this.lasty;
    this.running = true;
}

SB.Dragger.prototype.set = function(x, y)
{
    this.x = x;
    this.y = y;
}

SB.Dragger.prototype.stop = function(x, y)
{
    this.x = x;
    this.y = y;

    this.running = false;
}

SB.Dragger.prototype.update = function()
{
    if (!this.running)
    {
        return;
    }

    var dx = this.x - this.lastx;
    var dy = this.y - this.lasty;

    this.publish("move", dx, -dy);

    this.lastx = this.x;
    this.lasty = this.y;
}
