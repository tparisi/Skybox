/**
 *
 */
goog.provide('SB.PhysicsSystem');

/**
 * Interface for a PhysicsSystem.
 *
 * Allows multiple different backends for physics.
 * @interface
 */
SB.PhysicsSystem = function() {};

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the physics world.
 */
SB.PhysicsSystem.prototype.initialize = function() {};

/**
 * Terminates the physics world.
 */
SB.PhysicsSystem.prototype.terminate = function() {};

//---------------------------------------------------------------------
// Properties
//---------------------------------------------------------------------

/**
 * Sets the gravity of the simulation.
 * @param {number} x Gravity in the x direction.
 * @param {number} y Gravity in the y direction.
 * @param {number} z Gravity in the z direction.
 */
SB.PhysicsSystem.prototype.setGravity = function(x, y, z) {};

/**
 * Sets the bounds of the simulation.
 * @param {number} minX The minimum x value.
 * @param {number} maxX The maximum x value.
 * @param {number} minY The minimum y value.
 * @param {number} maxY The maximum y value.
 * @param {number] minZ The minimum z value.
 * @param {number} maxZ The maximum z value.
 */
SB.PhysicsSystem.prototype.setBounds = function(minX, maxX, minY, maxY, minZ, maxZ) {};

//---------------------------------------------------------------------
// Methods
//---------------------------------------------------------------------

/**
 * Adds a PhysicsBody to the simulation.
 * @param {SB.PhysicsBody} body The body to add to the simulation.
 */
SB.PhysicsSystem.prototype.addBody = function(body) {};

/**
 * Removes a PhysicsBody from the simulation.
 * @param {SB.PhysicsBody} body The body to remove from the simulation.
 */
SB.PhysicsSystem.prototype.removeBody = function(body) {};

/**
 * Updates the PhysicsSystem.
 */
SB.PhysicsSystem.prototype.update = function() {};