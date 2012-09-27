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

	root.addChild(b1);
	
	this.addEntity(root);

	root.realize();
}

