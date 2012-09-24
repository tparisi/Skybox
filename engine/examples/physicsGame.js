goog.provide('SB.Examples.PhysicsGame');
goog.require('SB.Game');
goog.require('SB.Services');
goog.require('SB.ShooterComponent');

SB.Examples.PhysicsGame = function()
{
    SB.Game.call(this);
	
}

goog.inherits(SB.Examples.PhysicsGame, SB.Game);

// We need this here and now - in file-loaded games it will be done by the loader
SB.Services.registerService("physics", SB.PhysicsSystemBox2D);

SB.Examples.PhysicsGame.prototype.initialize = function(param)
{
	
    this.radius = 2.5;
    this.height = 1.0;
    this.spacing = 2.5;

	SB.Game.prototype.initialize.call(this, param);
    
    SB.Graphics.instance.camera.position.set( 0, 100, 0 );
    SB.Graphics.instance.camera.lookAt(new THREE.Vector3(0, 0, 0));

	this.initEntities();
} ;

SB.Game.prototype.addOptionalServices = function()
{
	this.addService("physics");
}

SB.Examples.PhysicsGame.prototype.initEntities = function()
{
    this.createBoard();
    this.puck = this.createPuck(0, 75, 5.0, 1.0);

    var shooter = new SB.ShooterComponent();
    this.puck.addComponent(shooter);
    
    this.puck.realize();
} ;

SB.Examples.PhysicsGame.prototype.createBoard = function()
{
    // Create the middle puck
    this.createPuck(0, 0, this.radius, this.height).realize();

    // Create the horizontal pucks
    var offset = (2 * this.radius) + this.spacing;
    var x = offset;
    var y = 0.0;
    var i;

    for (i = 0; i < 4; ++i)
    {
        this.createPuck( x, y, this.radius, this.height).realize();
        this.createPuck(-x, y, this.radius, this.height).realize();

        x += offset;
    }

    // Create the vertical pucks
    x = 0.0;
    y = offset;

    for (i = 0; i < 4; ++i)
    {
        this.createPuck(x,  y, this.radius, this.height).realize();
        this.createPuck(x, -y, this.radius, this.height).realize();

        y += offset;
    }
	
	
    var boardEntity = new SB.Entity();

    // Create the transform
    // \todo entity.transform is a hack
    var transform = new SB.Transform();
    transform.rotation.x = 1.57079633;
    boardEntity.addComponent(transform);
    boardEntity.transform = transform;

    // Create the material
    var texture = THREE.ImageUtils.loadTexture("./images/board.png");
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;

    var material = new THREE.MeshBasicMaterial( { map: texture } );

    // Create the visual
    // \todo Scene add is a hack
    var boardVisual = new SB.Pane({parent:transform, width:100, height:100, material:material});
    boardEntity.addComponent(boardVisual);

    this.addEntity(boardEntity);
    
    boardEntity.realize();
} ;

SB.Examples.PhysicsGame.prototype.createPuck = function(x, y, radius, height)
{
    // Create the entity
    var entity = new SB.Entity();

    // Create the transform
    // \todo entity.transform is a hack
    var transform = new SB.Transform();
    transform.position.x = x;
    transform.position.y = height * 0.5;
    transform.position.z = y;
    entity.addComponent(transform);
    entity.transform = transform;

    // Create the visual
    // \todo Scene add is a hack
    var puckParams = {};
    puckParams.radiusTop    = radius;
    puckParams.radiusBottom = radius;
    puckParams.height       = height;
    puckParams.parent = transform;

    var puckVisual = new SB.CylinderVisual(puckParams);
    entity.addComponent(puckVisual);

    // Create the physics object
    var rigidBody = new SB.RigidBodyCircleBox2D(radius);
    entity.addComponent(rigidBody);
    entity.rigidBody = rigidBody;

    this.addEntity(entity);
    
    return entity;
} ;
