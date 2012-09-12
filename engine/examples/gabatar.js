Gabatar = function(param)
{
	SB.Entity.call(this, param);
	
	param = param || {};
	
	this.transform = new SB.Transform();
	
    var that = this;
    var callback = function(model) {
    	that.onModelLoaded(model);
    };
    
    var url = './models/body_hero_nopane.js';
    this.body = SB.Model.loadModel(url, null, callback);
    url = './models/avatar_display.js';
    this.display = new SB.CubeVisual({width:.444, height:.444, depth:.1, color:0xffffff, map: THREE.ImageUtils.loadTexture( "./images/Twitter1.jpg" )});
    this.display.position.y = 2.62;
    url = './models/avatar_frame.js';
    this.displayFrame = SB.Model.loadModel(url, null, callback);

	this.screenTracker = new SB.ScreenTracker( { referencePosition : new THREE.Vector3(0, 1.67, 0) });
	
	this.addComponent(this.transform);
	this.addComponent(this.body);	
	this.addComponent(this.display);	
	this.addComponent(this.displayFrame);	
	this.addComponent(this.screenTracker);	

	this.screenTracker.subscribe("position", this, this.onScreenPositionChanged);

	this.annotation = new SB.Annotation( { style : "text300" } );
	var userText = "Me";
	if (param.info)
	{
		userText = "<div><img src='" + param.info.profile_pic + "' width='37' height='37'/>" + 
		"<div style='position:absolute; top:4px; left: 48px;'> <b> " 
		+ param.info.user_name + "</b> @" + param.info.screen_name + "</div></div>";
	}
	
	this.annotation.setHTML(userText);
	this.annotation.show();
}

goog.inherits(Gabatar, SB.Entity);

Gabatar.prototype.realize = function() 
{
	SB.Entity.prototype.realize.call(this);
//    SB.Shaders.ToonShader.applyShader(this.display.object);
	this.screenTracker.start();
}


Gabatar.prototype.onModelLoaded = function(model)
{
	if (model)
	{
		model.applyShader(SB.Shaders.ToonShader);
	}
}


Gabatar.prototype.onScreenPositionChanged = function(pos)
{
	this.annotation.setPosition(pos);
}
