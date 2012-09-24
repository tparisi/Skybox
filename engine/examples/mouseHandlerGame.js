SB.Examples.MouseHandlerGame = function()
{
    SB.Game.call(this);
	
} ;

goog.inherits(SB.Examples.MouseHandlerGame, SB.Game);
	        
SB.Examples.MouseHandlerGame.prototype.initialize = function(param)
{	
	SB.Game.prototype.initialize.call(this, param);
 
	var root = new SB.Entity;
	
	var dd1 = new SB.Examples.DraggyDoor();
	dd1.transform.position.x = 5;

	var dd2 = new SB.Examples.DraggyDoor();
	dd2.transform.position.x = -5;
		        	
	root.addChild(dd1);	        	
	root.addChild(dd2);

	this.addEntity(root);

	this.viewer = new SB.Viewer({ headlight : true });
	this.viewer.transform.position.z = 10;
	root.addChild(this.viewer);
	
	root.realize();

	// this.viewer.viewpoint.camera.bind();

}

SB.Examples.MouseHandlerGame.highlightColor = 0xcc00cc;
SB.Examples.MouseHandlerGame.zoomFactor = 1.1666;