SB.Examples.RotateMe = function(param)
{
    // core services - maybe we move to service locator model?
    SB.Game.call(this);
}

goog.inherits(SB.Examples.RotateMe, SB.Game);
	        
SB.Examples.RotateMe.prototype.initialize = function(param)
{
	SB.Game.prototype.initialize.call(this, param);

	var entity = new SB.Entity();

	var pane = new SB.Pane();
	var rotator = new SB.PollingRotator({ target : pane });
	
	entity.addComponent(rotator);
	entity.addComponent(pane);
	
	this.addEntity(entity);
	
	entity.realize();
}
