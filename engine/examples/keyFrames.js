SB.Examples.KeyFrameGame = function()
{
	SB.Game.call(this);	    	
}

goog.inherits(SB.Examples.KeyFrameGame, SB.Game);

SB.Examples.KeyFrameGame.prototype.initialize = function(param)
{
	SB.Game.prototype.initialize.call(this, param);

	var root = new SB.Entity;
	
	var b1 = new SB.Examples.KeyFrameBall();
	b1.transform.position.x = 2;

	var viewer = new SB.Viewer({ headlight : true });
	viewer.viewpoint.transform.position.set(0, 0, 5);
	
	root.addChild(b1);
	root.addChild(viewer);
	
	this.addEntity(root);

	root.realize();
}

