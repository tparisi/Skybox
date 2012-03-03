/**
 * @fileoverview
 */
goog.provide('SB.PhysicsBodyBox2D');

/**
 * Implementation of a PhysicsBody using Box2D.
 *
 * @implements {SB.PhysicsBody}
 * @constructor
 */
SB.PhysicsBodyBox2D = function()
{
    /**
     * Internal representation of the body.
     * @type {b2BodyDef}
     */
    this._body = new b2BodyDef();
} ;

/**
 * @inheritDoc
 */
SB.PhysicsBodyBox2D.prototype.setMaterial = function(material)
{
    
} ;

/**
 * @protected
 * @inheritDoc
 */
SB.PhysicsBodyBox2D.prototype.setShape = function(shape)
{
    this._body.addShape(shape);
} ;
