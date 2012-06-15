SB.Examples.MouseHandlerGame = function()
{
    SB.Game.call(this);
} ;

goog.inherits(SB.Examples.MouseHandlerGame, SB.Game);
	        
SB.Examples.MouseHandlerGame.prototype.initEntities = function()
{
	var root = new SB.Entity;
	
	var dd1 = new SB.Examples.DraggyDoor();
	dd1.transform.position.x = 5;

	var dd2 = new SB.Examples.DraggyDoor();
	dd2.transform.position.x = -5;
		        	
	this.addEntity(root);
	root.addChild(dd1);	        	
	root.addChild(dd2);
	
	root.realize();
}

SB.Examples.MouseHandlerGame.highlightColor = 0xcc00cc;
SB.Examples.MouseHandlerGame.zoomFactor = 1.1666;