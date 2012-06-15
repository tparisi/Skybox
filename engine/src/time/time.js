/**
 * @fileoverview Main interface to the graphics and rendering subsystem
 * 
 * @author Tony Parisi
 * @author Don Olmstead
 */
goog.provide('SB.Time');

SB.Time = function()
{
	// Freak out if somebody tries to make 2
    if (SB.Time.instance)
    {
        throw new Error('Graphics singleton already exists')
    }
}


SB.Time.prototype.initialize = function(param)
{
	this.currentTime = Date.now();

	SB.Time.instance = this;
}

SB.Time.prototype.update = function()
{
	this.currentTime = Date.now();
}

SB.Time.instance = null;
	        
