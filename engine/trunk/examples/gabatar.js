Gabatar = function(param)
{
	SB.Entity.call(this, param);
	
	param = param || {};
	
	this.transform = new SB.Transform();
	
    var avParams = {};
    avParams.radiusTop    = 1;
    avParams.radiusBottom = 1;
    avParams.height       = 1.667;
    avParams.color = 0x0000ff;
//    avParams.ambient = 0x0000ff;

	this.visual = new SB.CylinderVisual(avParams);
	this.visual.position.y = 0.834;

	this.screenTracker = new SB.ScreenTracker( { referencePosition : new THREE.Vector3(0, 2, 0) });
	
	this.addComponent(this.transform);
	this.addComponent(this.visual);	
	this.addComponent(this.screenTracker);	

	this.screenTracker.subscribe("position", this, this.onScreenPositionChanged);

	this.annotation = new SB.Annotation( { style : "text500" } );
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
	this.screenTracker.start();
}

Gabatar.prototype.onScreenPositionChanged = function(pos)
{
	this.annotation.setPosition(pos);
}
