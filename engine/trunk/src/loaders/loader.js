/**
 * @fileoverview Loader - loads level files
 * 
 * @author Tony Parisi
 */

goog.provide('SB.Loader');
goog.require('SB.PubSub');

/**
 * @constructor
 * @extends {SB.PubSub}
 */
SB.Loader = function()
{
    SB.PubSub.call(this);	
}

goog.inherits(SB.Loader, SB.PubSub);
        
