
/**
 * @fileoverview Service locator for various game services.
 */
goog.provide('SB.GameServiceLocator');

/**
 * @constructor
 */
SB.GameServiceLocator = function()
{
    /**
     * The PhysicsSystem in use within the game.
     * @type {SB.PhysicsSystem}
     * @private
     */
    this.physics = null;

    if (SB.GameServiceLocator.instance_)
    {
        throw new Error('Cannot create two GameServiceLocator instances');
    }

    SB.GameServiceLocator.instance_ = this;
} ;

/**
 * Instance of the GameServiceLocator.
 * @static
 * @private
 */
SB.GameServiceLocator.instance_ = new SB.GameServiceLocator();

/**
 * Gets the PhysicsSystem associated with the game.
 * @returns {SB.PhysicsSystem}
 */
SB.GameServiceLocator.getPhysics = function()
{
    return SB.GameServiceLocator.instance_.physics;
} ;

/**
 * Sets the PhysicsSystem associated with the game.
 * @param {SB.PhysicsSystem} physics The PhysicsSystem to use.
 * @param physics
 */
SB.GameServiceLocator.setPhysics = function(physics)
{
    if (physics && SB.GameServiceLocator.instance_.physics)
    {
        throw new Error('Cannot have two physics systems present');
    }

    SB.GameServiceLocator.instance_.physics = physics;
} ;

SB.GameServiceLocator.update = function()
{
    var instance = SB.GameServiceLocator.instance_;

    if (instance)
    {
        // Update physics
        var physics = SB.GameServiceLocator.getPhysics();

        if (physics)
        {
            physics.update();
        }
    }
} ;
