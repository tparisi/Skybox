
/**
 * @fileoverview
 */
goog.provide('SB.RigidBodyBox2D');
goog.require('SB.Component');
goog.require('SB.PhysicsBody');

/**
 * Component representing a rigid body.
 * @constructor
 * @extends {SB.Component}
 * @implements {SB.PhysicsBody}
 */
SB.RigidBodyBox2D = function()
{
    SB.Component.call(this);

    /**
     * @type {b2BodyDef}
     * @protected
     */
    this.body = new b2BodyDef();
} ;

goog.inherits(SB.RigidBodyBox2D, SB.Component);

//---------------------------------------------------------------------
// Initialization/Termination
//---------------------------------------------------------------------

/**
 * Initializes the RigidBody component.
 */
SB.RigidBodyBox2D.prototype.realize = function()
{
    // Set the position based on the transform
    var transform = this._entity.transform;

    this.body.SetPosition(new b2Vec2(transform.position.x, transform.position.z));
	SB.Component.prototype.realize.call(this);
} ;

/**
 * Terminates the RigidBody component.
 */
SB.RigidBodyBox2D.prototype.terminate = function()
{

} ;

//---------------------------------------------------------------------
// PhysicsBody methods
//---------------------------------------------------------------------

SB.RigidBodyBox2D.prototype.setMaterial = function(material)
{

} ;

SB.RigidBodyBox2D.prototype.update = function()
{
    var position = this.body.GetPosition();

    // Set the position
    var transform = this._entity.transform;
    transform.position.x = position.x;
    transform.position.z = position.y;

    // \todo ROTATIONS
} ;

SB.RigidBodyBox2D.prototype.applyForce = function(x, y, z)
{
    var force = new b2Vec2(x, z);
    var position = this.body.GetPosition();

    this.body.ApplyImpulse(force, position);
//    this.body.ApplyForce(force, position);
}
