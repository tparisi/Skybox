SB.Examples.TrackerGame = function()
{
	SB.Game.call(this);	    	
}

goog.inherits(SB.Examples.TrackerGame, SB.Game);

SB.Examples.TrackerGame.prototype.initialize = function(param)
{
	SB.Game.prototype.initialize.call(this, param);

	this.turnDir = new THREE.Vector3;
	this.moveDir = new THREE.Vector3;
	this.trackerPos = new THREE.Vector3;
	
	this.lastdx = 0;
	this.dragging = false;
	this.animateDrag = true;
	this.dragAnimation = null;
	this.turnSpeed = 1;
	
	// Scene root
	var root = new SB.Entity;
	this.root = root;

	// Headlight
    var headlight = new SB.DirectionalLight({ color : 0xFFFFFF, intensity : 1});
    root.addComponent(headlight);

    // A timer
	var timer = new SB.Timer( { loop : true } );
	timer.subscribe("time", this, this.onTimeChanged);
	timer.start();
	root.addComponent(timer);
	
/*    // Camera
	var mainCamera = new SB.Entity;
	
	var transform = new SB.Transform;
	mainCamera.addComponent(transform);

	var camera = new SB.Camera({fov: 50, active : true, position:new THREE.Vector3(0, 1, 5)} );
	mainCamera.addComponent(camera);

	root.addChild(mainCamera);
	
	this.mainCamera = mainCamera;
*/
	// Controller
	var controller = SB.Prefabs.FPSController({ active : true, headlight : true });
	root.addChild(controller);
	
    // Dragger thing
	var dragger = new SB.Dragger();
	root.addComponent(dragger);

	dragger.subscribe("move", this, this.onDraggerMove);
	this.dragger = dragger;
	
	// Something to drag
	var carousel = new SB.Entity;
	
	transform = new SB.Transform();
	carousel.addComponent(transform);

//	transform.rotation.y = Math.PI / 8;
	
	this.carousel = carousel;
	
	var grid = new SB.Entity;
	
	var visual = new SB.Grid({size: 14, color:0});
	grid.addComponent(visual);
	
	carousel.addChild(grid);
	
    // Something to draw
	var cylinder = new SB.Entity;
	
	transform = new SB.Transform();
	transform.position.z = -10;
    visual = new SB.CylinderVisual({radiusTop : 1, radiusBottom : 1, height : 1.667, color : 0x0000ff });
    
    cylinder.addComponent(transform);
    cylinder.addComponent(visual);		
    
	carousel.addChild(cylinder);

	// Something to show tracker
	var cube = new SB.Entity;
	
	transform = new SB.Transform();
	transform.position.z = 3;
    visual = new SB.CubeVisual({width:.5, height:.25, depth:.25, color : 0x00ff00 });
    
    cube.addComponent(transform);
    cube.addComponent(visual);		
    
	cylinder.addChild(cube);
	
	this.cube = cube;
	
 
    this.cylinder = cylinder;
    
	root.addChild(carousel);
    
	this.addEntity(root);
	root.realize();
	
    // This tracks cylinder movement relative to carousel
	var controllerScript = controller.getComponent(SB.FPSControllerScript);
	controllerScript.setCameraPos(new THREE.Vector3(0, 1, 10));
	var camera = controllerScript.viewpoint.getComponent(SB.Camera);
	
	var tracker = new SB.Tracker({reference : camera, referencePosition:new THREE.Vector3(0, 0, -3)});
	cylinder.addComponent(tracker);
	tracker.subscribe("position", this, this.onTrackerPosition);
	tracker.start();    
	
	this.root = root;
}


SB.Examples.TrackerGame.prototype.turn = function(dir)
{
	this.carousel.transform.rotation.addSelf(dir);
}

SB.Examples.TrackerGame.prototype.move = function(dir)
{
	this.carousel.transform.position.addSelf(dir);
}

SB.Examples.TrackerGame.prototype.onMouseDown = function(x, y)
{
//	this.dragger.start(x, y);
	this.dragging = true;
	
	SB.Game.prototype.onMouseDown.call(this, x, y);
}

SB.Examples.TrackerGame.prototype.onMouseUp = function(x, y)
{
//	this.dragger.stop(x, y);
	this.dragging = false;
	/*
	if (this.cube.transform.position.z > 3)
	{
		this.cube.transform.position.set(0, 0, 3);
		this.cube.transform.rotation.y = 0;
	}
	else
	{
		this.cube.transform.position.copy(this.trackerPos);
		this.cube.transform.rotation.y = -this.carousel.transform.rotation.y;
	}
	*/
	this.animating = !this.animating;
	
	this.lastdx = 0;

	SB.Game.prototype.onMouseUp.call(this, x, y);
}

SB.Examples.TrackerGame.prototype.onMouseMove = function(x, y)
{
//	this.dragger.set(x, y);

	SB.Game.prototype.onMouseMove.call(this, x, y);
}

SB.Examples.TrackerGame.prototype.onDraggerMove = function(dx, dy)
{
	if (Math.abs(dx) <= 2)
		dx = 0;
	
	dx *= .002;
	
	if (dx)
	{
		this.lastdx = dx;
	}
	else if (this.lastdx && this.dragging)
	{
		dx = this.lastdx;
	}

	if (dx != 0)
	{
		/*
		this.moveDir.set(dx, 0, 0);
		this.move(this.moveDir);
		*/
		this.turnDir.set(0, -dx, 0);
		this.turn(this.turnDir);
		
	}	
}

SB.Examples.TrackerGame.prototype.onTrackerPosition = function(pos)
{
	console.log("New tracker position: ", pos.x, ", ", pos.y, ", ", pos.z);
	this.trackerPos = pos;
	this.cube.transform.position.copy(this.trackerPos);
	this.cube.transform.rotation.y = -this.carousel.transform.rotation.y;
}

SB.Examples.TrackerGame.prototype.onTimeChanged = function(t)
{
	if (this.animating)
	{
		this.carousel.transform.rotation.y += 0.01;
	}
}
