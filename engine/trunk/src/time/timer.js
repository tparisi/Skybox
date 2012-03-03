/**
 * @fileoverview Timer - component that generates time events
 * 
 * @author Tony Parisi
 */
goog.provide('SB.Timer');
goog.require('SB.Component');

SB.Timer = function(param)
{
    SB.Component.call(this);
    this.currentTime = SB.Time.instance.currentTime;
    this.running = false;
    this.duration = (param && param.duration) ? param.duration : 0;
}

goog.inherits(SB.Timer, SB.Component);

SB.Timer.prototype.update = function()
{
	if (!this.running)
		return;
	
	var now = SB.Time.instance.currentTime;
	var deltat = now - this.currentTime;
	
	if (deltat)
	{
	    this.publish("time", now);		
	}
	
	if (this.duration)
	{
		var mod = now % this.duration;
		var fract = mod / this.duration;
		
		this.publish("fraction", fract);
	}
	
	this.currentTime = now;
	
}

SB.Timer.prototype.start = function()
{
	this.running = true;
}

SB.Timer.prototype.stop = function()
{
	this.running = false;
}

