SB.Examples.StatefulRotatorGame = function(param)
{
    SB.Game.call(this);
} ;

goog.inherits(SB.Examples.StatefulRotatorGame, SB.Game);

SB.Examples.StatefulRotatorGame.prototype.initEntities = function()
{
    var entity = new SB.Entity();

    var pane = new SB.Pane();
    var sr = new SB.Examples.StatefulRotator({ target : pane });

    entity.addComponent(sr);
    entity.addComponent(pane);

    this.addEntity(entity);
    
    entity.realize();
} ;

