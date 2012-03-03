/**
 * @fileoverview A visual containing a model in Collada format
 * @author Tony Parisi
 */
goog.provide('SB.ColladaModel');
goog.require('SB.Model');

SB.ColladaModel = function(param) 
{
    SB.Model.call(this, param);
}

goog.inherits(SB.ColladaModel, SB.Model);
	       
SB.ColladaModel.prototype.handleLoaded = function(data)
{
	this.object = data.scene;
    this.skin = data.skins[0];
    
    this.addToScene();
}
	        
SB.ColladaModel.prototype.update = function()
{
	SB.Model.prototype.update.call(this);
	
	if (!this.animating)
		return;
	
	if ( this.skin )
	{

    	var now = Date.now();
    	var deltat = (now - this.startTime) / 1000;
    	var fract = deltat - Math.floor(deltat);
    	this.frame = fract * this.frameRate;
		

		for ( var i = 0; i < this.skin.morphTargetInfluences.length; i++ )
		{
			this.skin.morphTargetInfluences[ i ] = 0;
		}

		this.skin.morphTargetInfluences[ Math.floor( this.frame ) ] = 1;

	}
}
