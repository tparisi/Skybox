goog.provide('SB.PhysicsBody');

/**
 * Interface for a PhysicsBody
 * @interface
 */
SB.PhysicsBody = function() {};

/**
 * Sets the PhysicsMaterial for the body.
 * @param {SB.PhysicsMaterial} material The material to attach to the body.
 */
SB.PhysicsBody.prototype.setMaterial = function(material) {};
