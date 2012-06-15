/**
 *
 */
goog.require('SB.Service');
goog.provide('SB.PhysicsService');

/**
 * Interface for a PhysicsService.
 *
 * Allows multiple different backends for physics.
 * @interface
 * @extends {SB.Service}
 */
SB.PhysicsService = function() {};

goog.inherits(SB.PhysicsService, SB.Service);

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the physics world.
 */
SB.PhysicsService.prototype.initialize = function(param) {};

/**
 * Terminates the physics world.
 */
SB.PhysicsService.prototype.terminate = function() {};

//---------------------------------------------------------------------
// Properties
//---------------------------------------------------------------------

/**
 * Sets the gravity of the simulation.
 * @param {number} x Gravity in the x direction.
 * @param {number} y Gravity in the y direction.
 * @param {number} z Gravity in the z direction.
 */
SB.PhysicsService.prototype.setGravity = function(x, y, z) {};

/**
 * Sets the bounds of the simulation.
 * @param {number} minX The minimum x value.
 * @param {number} maxX The maximum x value.
 * @param {number} minY The minimum y value.
 * @param {number} maxY The maximum y value.
 * @param {number] minZ The minimum z value.
 * @param {number} maxZ The maximum z value.
 */
SB.PhysicsService.prototype.setBounds = function(minX, maxX, minY, maxY, minZ, maxZ) {};

//---------------------------------------------------------------------
// Methods
//---------------------------------------------------------------------

/**
 * Adds a PhysicsBody to the simulation.
 * @param {SB.PhysicsBody} body The body to add to the simulation.
 */
SB.PhysicsService.prototype.addBody = function(body) {};

/**
 * Removes a PhysicsBody from the simulation.
 * @param {SB.PhysicsBody} body The body to remove from the simulation.
 */
SB.PhysicsService.prototype.removeBody = function(body) {};

/**
 * Updates the PhysicsService.
 */
SB.PhysicsService.prototype.update = function() {};