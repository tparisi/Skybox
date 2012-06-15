goog.provide('SB.RigidBodyCircleBox2D');
goog.require('SB.RigidBodyBox2D');

SB.RigidBodyCircleBox2D = function(radius)
{
    SB.RigidBodyBox2D.call(this);

    // Create the fixture definition
    var fixtureDef = new b2FixtureDef();
	fixtureDef.shape = new b2CircleShape(radius);
	fixtureDef.friction = 0.4;
	fixtureDef.restitution = 0.6;
	fixtureDef.density = 1.0;

    // Create the body definition
	var ballBd = new b2BodyDef();
	ballBd.type = b2Body.b2_dynamicBody;
	ballBd.position.Set(0,0);

    // Create the body
	this.body = SB.Services.physics.addBody(ballBd);

    // Create the fixture
	this.fixture = this.body.CreateFixture(fixtureDef);
} ;

goog.inherits(SB.RigidBodyCircleBox2D, SB.RigidBodyBox2D);
