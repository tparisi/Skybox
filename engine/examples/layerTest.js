SB.Examples.LayerTest = function()
{
	SB.Game.call(this);	    	
}

goog.inherits(SB.Examples.LayerTest, SB.Game);

SB.Examples.LayerTest.prototype.initialize = function(param)
{
	SB.Game.prototype.initialize.call(this, param);

	var root = new SB.Entity;
	
	var e = new SB.Entity;
	var transform = new SB.Transform;
	e.addComponent(transform);
	var cube = new SB.CubeVisual;
	e.addComponent(cube);
	
	root.addChild(e);
	
	var b1 = new SB.Examples.LayerObject();
	//b1.transform.position.x = 2;
	
	var headlight = new SB.DirectionalLight({ layer:SB.Graphics.instance.backgroundLayer, color : 0xFFFFFF, intensity : 1});
    root.addComponent(headlight);
	
	root.addChild(b1);
	
	this.addEntity(root);

	root.realize();
}

