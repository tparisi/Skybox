/**
 * @fileoverview General-purpose key frame animation
 * @author Tony Parisi
 */
goog.provide('SB.KeyFrame');
goog.require('SB.Component');

/**
 * @constructor
 * @extends {SB.Component}
 */
SB.KeyFrame = function(param) 
{
    SB.Component.call(this, param);
	    		
	this.keys = [];
	this.values = [];
	
	if (param && param.keys && param.values)
	{
		this.setValue(param.keys, param.values);
	}	    		

	this.duration = (param && param.duration) ? param.duration : SB.KeyFrame.default_duration;
	this.loop = (param && param.loop) ? param.loop : false;
	this.easeOut = (param && param.easeOut) ? param.easeOut : false;
	this.running = false;
}

goog.inherits(SB.KeyFrame, SB.Component);

SB.KeyFrame.prototype.setValue = function(keys, values)
{
	this.keys = [];
	this.values = [];
	if (keys && keys.length && values && values.length)
	{
		this.copyKeys(keys, this.keys);
		this.copyValues(values, this.values);
	}
}

SB.KeyFrame.prototype.copyKeys = function(from, to)
{
	var i = 0, len = from.length;
	for (i = 0; i < len; i++)
	{
		to[i] = from[i];
	}
}

SB.KeyFrame.prototype.copyValues = function(from, to)
{
	var i = 0, len = from.length;
	for (i = 0; i < len; i++)
	{
		var val = {};
		this.copyValue(from[i], val);
		to[i] = val;
	}
}

SB.KeyFrame.prototype.copyValue = function(from, to)
{
	for ( var property in from ) {
		
		if ( from[ property ] === null ) {		
		continue;		
		}

		to[ property ] = from[ property ];
	}
}

SB.KeyFrame.prototype.tween = function(from, to, fract)
{
	var value = {};
	for ( var property in from ) {
		
		if ( from[ property ] === null ) {		
		continue;		
		}

		var range = to[property] - from[property];
		var delta = range * fract;
		value[ property ] = from[ property ] + delta;
	}
	
	return value;
}

SB.KeyFrame.prototype.start = function()
{
	if (this.running)
		return;
	
	this.startTime = Date.now();
	this.running = true;
}

SB.KeyFrame.prototype.stop = function()
{
	this.running = false;
}
	        
SB.KeyFrame.prototype.update = function()
{
	if (!this.running)
		return;
	
	var now = Date.now();
	var deltat = (now - this.startTime) % this.duration;
	var nCycles = Math.floor((now - this.startTime) / this.duration);
	var fract = deltat / this.duration;
	if (this.easeOut)
	{
		fract = SB.KeyFrame.ease(fract);
	}

	if (nCycles >= 1 && !this.loop)
	{
		this.running = false;
		return;
	}
	
	var i, len = this.keys.length;
	if (fract == this.keys[0])
	{
		this.publish("value", this.values[0]);
		return;
	}
	else if (fract >= this.keys[len - 1])
	{
		this.publish("value", this.values[len - 1]);
		return;
	}

	for (i = 0; i < len - 1; i++)
	{
		var key1 = this.keys[i];
		var key2 = this.keys[i + 1];

		if (fract >= key1 && fract <= key2)
		{
			var val1 = this.values[i];
			var val2 = this.values[i + 1];
			var value = this.tween(val1, val2, (fract - key1) / (key2 - key1));
			this.publish("value", value);
			break;
		}
	}
}

SB.KeyFrame.ease = function(n) {
	// Len's ease function, what does it do?
	// Maybe let's borrow the functions from Tween.js?
    var q = 0.07813 - n / 2,
        alpha = -0.25,
        Q = Math.sqrt(0.0066 + q * q),
        x = Q - q,
        X = Math.pow(Math.abs(x), 1/3) * (x < 0 ? -1 : 1),
        y = -Q - q,
        Y = Math.pow(Math.abs(y), 1/3) * (y < 0 ? -1 : 1),
        t = X + Y + 0.25;
    return Math.pow(1 - t, 2) * 3 * t * 0.1 + (1 - t) * 3 * t * t + t * t * t;
}

SB.KeyFrame.default_duration = 1000;
