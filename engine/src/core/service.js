/**
 *
 */
goog.provide('SB.Service');

/**
 * Interface for a Service.
 *
 * Allows multiple different backends for the same type of service.
 * @interface
 */
SB.Service = function() {};

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the physics world.
 */
SB.Service.prototype.initialize = function(param) {};

/**
 * Terminates the physics world.
 */
SB.Service.prototype.terminate = function() {};


/**
 * Updates the Service.
 */
SB.Service.prototype.update = function() {};