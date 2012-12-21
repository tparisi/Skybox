/**
 * @fileoverview General-purpose key frame animation
 * @author Tony Parisi
 */
goog.provide('SB.MeshAnimator');
goog.require('SB.Component');

// MeshAnimator class
// Construction/initialization
SB.MeshAnimator = function(param) 
{
    SB.Component.call(this, param);
	    		
	param = param || {};
	
	this.skins = param.skins || [];
	this.running = false;
	this.frame = 0;
	this.duration = param.duration ? param.duration : SB.MeshAnimator.default_duration;
	this.frameRate = SB.MeshAnimator.default_frame_rate;
	this.loop = param.loop ? param.loop : false;
}

goog.inherits(SB.MeshAnimator, SB.Component);

// Start/stop
SB.MeshAnimator.prototype.start = function()
{
	if (this.running)
		return;
	
	this.startTime = Date.now();
	this.running = true;
}

SB.MeshAnimator.prototype.stop = function()
{
	this.running = false;
	this.publish("complete");
}

// Update - drive key frame evaluation
SB.MeshAnimator.prototype.update = function()
{
	if (!this.running)
		return;
		
	var skin = this.skins[0];
	
	if ( skin )
	{
    	var now = Date.now();
    	var deltat = (now - this.startTime) / 1000;
    	var fract = deltat - Math.floor(deltat);
    	this.frame = fract * this.frameRate;
		
		for ( var i = 0; i < skin.morphTargetInfluences.length; i++ )
		{
			skin.morphTargetInfluences[ i ] = 0;
		}

		skin.morphTargetInfluences[ Math.floor( this.frame ) ] = 1;
	}	
}
// Statics
SB.MeshAnimator.default_duration = 1000;
SB.MeshAnimator.default_frame_rate = 30;
