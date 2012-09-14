SB.Examples.PlaneDraggerGame = function()
{
	SB.Game.call(this);	    	
}

goog.inherits(SB.Examples.PlaneDraggerGame, SB.Game);

SB.Examples.PlaneDraggerGame.prototype.initEntities = function()
{
	var root = new SB.Entity;
	
	var entity = new SB.Entity;
	
	var transform = new SB.Transform();
    var visual = new SB.CylinderVisual({radiusTop : 1, radiusBottom : 1, height : 1.667, color : 0x0000ff });
    var picker = new SB.Picker({ overCursor : 'pointer' });
    var planeDragger = new SB.PlaneDragger();

    picker.subscribe("mouseDown", this, this.onPickerMouseDown);
    picker.subscribe("mouseUp", this, this.onPickerMouseUp);
    picker.subscribe("mouseMove", this, this.onPickerMouseMove);
    planeDragger.subscribe("drag", this, this.onDraggerDrag);
    
    this.planeDragger = planeDragger;
    
    entity.addComponent(transform);
    entity.addComponent(visual);	
    entity.addComponent(picker);	
    entity.addComponent(planeDragger);	

    root.addChild(entity);
    
    this.draggableCylinder = entity;
        
	this.viewer = new SB.Viewer({ headlight : true });
	this.viewer.transform.position.z = 5;
	root.addChild(this.viewer);
    
	this.addEntity(root);
	root.realize();

	this.viewer.viewpoint.camera.bind();
	
}

SB.Examples.PlaneDraggerGame.prototype.onPickerMouseDown = function(x, y)
{
    this.planeDragger.beginDrag(x, y);
}

SB.Examples.PlaneDraggerGame.prototype.onPickerMouseUp = function(x, y)
{
    this.planeDragger.endDrag(x, y);
}

SB.Examples.PlaneDraggerGame.prototype.onPickerMouseMove = function(x, y)
{
    this.planeDragger.drag(x, y);
}

SB.Examples.PlaneDraggerGame.prototype.onDraggerDrag = function(pos)
{
    this.draggableCylinder.transform.position.copy(pos);
}
