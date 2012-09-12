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
	
    SB.Graphics.instance.camera.position.set( 0, 20, 0 );
    SB.Graphics.instance.camera.lookAt(new THREE.Vector3(0, 0, 0));
}

SB.Examples.ToonDemo.prototype.initEntities = function()
{
	var light = new SB.Entity();
	var transform  = new SB.Transform();
	light.addComponent(transform);
	light.transform = transform;
	
	var dirLight = new SB.LightComponent();
	light.addComponent(dirLight);
	light.realize();

	this.initModel('models/failwhale.js', 0, 0, 0);
//	this.initModel('trees01.js', 100, 0, 0);
}

SB.Examples.ToonDemo.prototype.initModel = function(url, x, y, z)
{
	var entity = new SB.Entity();
	
    var transform = new SB.Transform();
    transform.position.x = x;
    transform.position.y = y;
    transform.position.z = z;
    entity.addComponent(transform);
    entity.transform = transform;
	
    var that = this;
    var callback = function(model) {
    	that.onModelLoaded(model);
    };
    
    var model = SB.Model.loadModel(url, null, callback);
	entity.addComponent(model);
	
	entity.realize();
	
	this.addEntity(entity);
}



SB.Examples.ToonDemo.prototype.onModelLoaded = function(model)
{
	if (model)
	{
		model.applyShader(SB.Shaders.ToonShader);
	}
}

