SB.Examples.DuckRiders = function()
{
	SB.Game.call(this);	
}

goog.inherits(SB.Examples.DuckRiders, SB.Game);

SB.Examples.DuckRiders.prototype.initialize = function(param)
{
	SB.Game.prototype.initialize.call(this, param);

	var root = new SB.Entity;
	
	var dr1 = new SB.Examples.DuckRider();
	dr1.transform.position.x = 5;

	var dr2 = new SB.Examples.DuckRider();
	dr2.transform.position.x = -5;
	
	root.addChild(dr1);
	root.addChild(dr2);
	
	this.addEntity(root);

	this.viewer = new SB.Viewer({ headlight : true });
	this.viewer.transform.position.z = 10;
	root.addChild(this.viewer);
	
	root.realize();

	this.viewer.viewpoint.camera.setActive(true);
	
}

