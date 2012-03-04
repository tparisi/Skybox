goog.provide('SB.Examples.ToonDemo');
goog.require('SB.Game');
goog.require('SB.Services');

SB.Examples.ToonDemo = function()
{
	SB.Game.call(this);
}

goog.inherits(SB.Examples.ToonDemo, SB.Game);

SB.Examples.ToonDemo.prototype.initialize = function(param)
{
	SB.Game.prototype.initialize.call(this, param);
	
    SB.Graphics.instance.camera.position.set( 0, 100, 0 );
    SB.Graphics.instance.camera.lookAt(new THREE.Vector3(0, 0, 0));
}

SB.Examples.ToonDemo.prototype.initEntities = function()
{
	var entity = new SB.Entity();
	
	var transform = new SB.Transform();
	entity.addComponent(transform);
	entity.transform = transform;
	
//	var model = new SB.CylinderVisual();
	var model = SB.Model.loadModel('trees01.js');
	entity.addComponent(model);
	
	entity.realize();
	
	this.addEntity(entity);
}
