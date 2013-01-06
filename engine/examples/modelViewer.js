SB.Examples.ModelViewer = function()
{
	SB.Game.call(this);	    	
}

goog.inherits(SB.Examples.ModelViewer, SB.Game);

SB.Examples.ModelViewer.prototype.initialize = function(param)
{
	param.tabstop = true;
	
	SB.Game.prototype.initialize.call(this, param);

	// Scene root
	var root = new SB.Entity;
	this.root = root;
	root.transform = new SB.Transform;
	root.addComponent(root.transform);
	
    // A timer
	var timer = new SB.Timer( { loop : true } );
	timer.subscribe("time", this, this.onTimeChanged);
	timer.start();
	root.addComponent(timer);
	
	// Controller
	var controller = SB.Prefabs.ModelController({ active : true, headlight : true });
	root.addChild(controller);
	
	var grid = new SB.Entity;
	
	var visual = new SB.Grid({size: 14, color:0});
	grid.addComponent(visual);
	
	root.addChild(grid);
	
    // Something to draw
	var cube = new SB.Entity;
	
	transform = new SB.Transform();
	transform.position.z = -10;
    visual = new SB.CubeVisual({width : 1, depth : 1, height : 1.667, color : 0x0000ff });
    
    cube.addComponent(transform);
    cube.addComponent(visual);		
    
	root.addChild(cube);

	this.cube = cube;
    
	this.addEntity(root);
	root.realize();
	
    // This tracks cylinder movement relative to carousel
	var controllerScript = controller.getComponent(SB.ModelControllerScript);
	var camera = controllerScript.viewpoint.getComponent(SB.Camera);
	
	this.root = root;
}

SB.Examples.ModelViewer.prototype.onTimeChanged = function(t)
{
	if (this.animating)
	{
	}
}
