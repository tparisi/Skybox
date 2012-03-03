/**
 * @fileoverview Base class for visual elements.
 * @author Tony Parisi
 */
goog.provide('SB.Visual');
goog.require('SB.SceneComponent');

/**
 * @constructor
 */
SB.Visual = function(param) {
	
	SB.SceneComponent.call(this);
	
} ;

goog.inherits(SB.Visual, SB.SceneComponent);
