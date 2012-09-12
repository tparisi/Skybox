/**
 * @fileoverview General-purpose key frame animation
 * @author Tony Parisi
 */
goog.provide('SB.KeyFrameAnimator');
goog.require('SB.Component');

// KeyFrameAnimator class
// Construction/initialization
SB.KeyFrameAnimator = function(param) 
{
    SB.Component.call(this, param);
	    		
	param = param || {};
	
	this.interpdata = param.interps || [];
	this.running = false;
	this.duration = param.duration ? param.duration : SB.KeyFrameAnimator.default_duration;
	this.loop = param.loop ? param.loop : false;
}

goog.inherits(SB.KeyFrameAnimator, SB.Component);
	
SB.KeyFrameAnimator.prototype.realize = function()
{
	SB.Component.prototype.realize.call(this);
	
	if (this.interpdata)
	{
		this.createInterpolators(this.interpdata);
	}	    		
}

SB.KeyFrameAnimator.prototype.createInterpolators = function(interpdata)
{
	this.interps = [];
	
	var i, len = interpdata.length;
	for (i = 0; i < len; i++)
	{
		var data = interpdata[i];
		var interp = new SB.Interpolator({ keys: data.keys, values: data.values, target: data.target });
		interp.realize();
		this.interps.push(interp);
	}
}

// Start/stop
SB.KeyFrameAnimator.prototype.start = function()
{
	if (this.running)
		return;
	
	this.startTime = Date.now();
	this.running = true;
}

SB.KeyFrameAnimator.prototype.stop = function()
{
	this.running = false;
	this.publish("complete");
}

// Update - drive key frame evaluation
SB.KeyFrameAnimator.prototype.update = function()
{
	if (!this.running)
		return;
	
	var now = Date.now();
	var deltat = (now - this.startTime) % this.duration;
	var nCycles = Math.floor((now - this.startTime) / this.duration);
	var fract = deltat / this.duration;

	if (nCycles >= 1 && !this.loop)
	{
		this.running = false;
		this.publish("complete");
		var i, len = this.interps.length;
		for (i = 0; i < len; i++)
		{
			this.interps[i].interp(1);
		}
		return;
	}
	else
	{
		var i, len = this.interps.length;
		for (i = 0; i < len; i++)
		{
			this.interps[i].interp(fract);
		}
	}
}
// Statics
SB.KeyFrameAnimator.default_duration = 1000;
