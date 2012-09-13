/**
 * @fileoverview PollingRotator - converts x,y mouse motion into rotation about an axis (polling)
 * 
 * @author Tony Parisi
 */
goog.provide('SB.PollingRotator');
goog.require('SB.Component');

SB.PollingRotator = function(param)
{
    SB.Component.call(this, param);
}

goog.inherits(SB.PollingRotator, SB.Component);

SB.PollingRotator.prototype.realize = function()
{
	this.lastState = SB.Mouse.instance.getState();
	this.target = (this.param && this.param.target) ? this.param.target : null;
}

SB.PollingRotator.prototype.update = function()
{
    var state = SB.Mouse.instance.getState();

    if (state.buttons.left)
    {
        var dx = state.x - this.lastState.x;
        var dy = state.y - this.lastState.y;

        this.target.rotation.y += dx * 0.01;
    }
    else
    {
    }

    this.lastState =
    {
        x : state.x, y: state.y,
        buttons : { left : state.buttons.left, middle : state.buttons.middle, right : state.buttons.right },
        scroll : state.scroll
    };
}
