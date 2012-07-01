/**
 * @fileoverview Main interface to the graphics and rendering subsystem
 * 
 * @author Tony Parisi
 */
goog.provide('SB.Graphics');

SB.Graphics = function()
{
	// Freak out if somebody tries to make 2
    if (SB.Graphics.instance)
    {
        throw new Error('Graphics singleton already exists')
    }
	
	SB.Graphics.instance = this;
}
	        
SB.Graphics.instance = null;
