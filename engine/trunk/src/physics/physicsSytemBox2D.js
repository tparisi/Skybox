/**
 * @fileoverview
 */
goog.provide('SB.PhysicsSystemBox2D');
goog.require('SB.PhysicsService');

/**
 * Implementation of a PhysicsSystem using Box2D.
 *
 * @constructor
 * @implements {PhysicsService}
 */
SB.PhysicsSystemBox2D = function()
{
    /**
     * @type {b2World}
     */
    this._world = null;

    /**
     * @type {b2AABB}
     */
    //this.worldBounds_ = new b2AABB();

    /**
     * @type {b2Vec2}
     */
    this._gravity = new b2Vec2(0, 0);

} ;

/**
 * @inheritDoc
 */
SB.PhysicsSystemBox2D.prototype.setGravity = function(x, y, z)
{
    // Ignore the y, treat z as y
    this._gravity.x = x;
    this._gravity.y = z;
} ;

/**
 * @inheritDoc
 */
SB.PhysicsSystemBox2D.prototype.setBounds = function(minX, maxX, minY, maxY, minZ, maxZ)
{
    // Ignore the y, treat z as y
    //this.worldBounds_.minVertex.Set(minX, minZ);
    //this.worldBounds_.maxVertex.Set(maxX, maxZ);
} ;

/**
 * @inheritDoc
 */
SB.PhysicsSystemBox2D.prototype.initialize = function(param)
{
    if (this._world)
    {
        throw new Error('Cannot initialize the physics system twice');
    }

    // Create the world
    this._world = new b2World(this._gravity, true);
    this._world.SetWarmStarting(true);

    this.setGravity(0, 0, 0);

} ;

/**
 * @inheritDoc
 */
SB.PhysicsSystemBox2D.prototype.terminate = function()
{
    if (!this._world)
    {
        throw new Error('Cannot terminate the physics system before its initialized');
    }

    // Destroy the world
    this._world = null;
} ;

/**
 * @inheritDoc
 */
SB.PhysicsSystemBox2D.prototype.update = function() {
	
    var elapsed = 1 / 60;

    this._world.ClearForces();
    this._world.Step(elapsed, 6, 2);
} ;

SB.PhysicsSystemBox2D.prototype.addBody = function(body) {
    return this._world.CreateBody(body);
}
