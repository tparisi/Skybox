SB.Examples.DuckRider = function()
{
	SB.Entity.call(this);
	this.transform = new SB.Transform();
	this.pane = new SB.Pane();
	this.picker = new SB.Picker();
	this.rotator = new SB.Rotator();
	this.dragger = new SB.Dragger();
	this.zoomer = new SB.Zoomer();
	this.mover = new SB.KeyFrame({ loop : false, easeOut : true });
	this.spinner = new SB.KeyFrame({ loop : true, easeOut : false });
	
	this.addComponent(this.transform);
	this.addComponent(this.pane);
	this.addComponent(this.picker);
	this.addComponent(this.rotator);
	this.addComponent(this.dragger);
	this.addComponent(this.zoomer);
	this.addComponent(this.spinner);
	this.addComponent(this.mover);

	this.dragger.subscribe("move", this, this.onDraggerMove);
	this.rotator.subscribe("rotate", this, this.onRotatorRotate);
	this.zoomer.subscribe("scale", this, this.onZoomerScale);
	this.spinner.subscribe("value", this, this.onSpinnerValue);
	this.mover.subscribe("value", this, this.onMoverValue);
	
	this.picker.subscribe("mouseOver", this, this.onMouseOver);
	this.picker.subscribe("mouseOut", this, this.onMouseOut);
	this.picker.subscribe("mouseMove", this, this.onMouseMove);
	this.picker.subscribe("mouseDown", this, this.onMouseDown);
	this.picker.subscribe("mouseUp", this, this.onMouseUp);
	this.picker.subscribe("mouseScroll", this, this.onMouseScroll);
	
	this.dragging = true;
	this.rotating = true;
	
	this.savedColor = null;

	var loader = new SB.Loader;
	loader.subscribe("loaded", this, this.onSceneLoaded);
	loader.loadScene('./duck.dae');
}

goog.inherits(SB.Examples.DuckRider, SB.Entity);

SB.Examples.DuckRider.prototype.onSceneLoaded = function(data)
{
	if (data.scene)
	{
		var scene = data.scene;
		scene.scale.x = scene.scale.y = scene.scale.z = 0.01;
		this.addComponent(scene);
	}
}

SB.Examples.DuckRider.prototype.onMouseOver = function(x, y)
{
	// console.log("Got delegate mouse over: " + x + ", " + y);
	this.savedColor = this.pane.object.material.color.getHex();
	this.pane.object.material.color.setHex(SB.Examples.DuckRider.highlightColor);
}

SB.Examples.DuckRider.prototype.onMouseOut = function(x, y)
{
	// console.log("Got delegate mouse out: " + x + ", " + y);
	this.pane.object.material.color.setHex(this.savedColor);
}
	        
SB.Examples.DuckRider.prototype.onMouseMove = function(x, y)
{
	// console.log("Got delegate mouse move: " + x + ", " + y);
	if (this.dragging)
	{
		this.dragger.set(x, y);
	}
	
	if (this.rotating)
	{
		this.rotator.set(x, y);
	}
}

SB.Examples.DuckRider.prototype.onMouseDown = function(x, y)
{
	this.spinner.stop();
	this.lastrotate = 0;
	this.lastdx = this.lastdy = 0;
	
	// console.log("Got delegate mouse down: " + x + ", " + y);
	if (this.dragging)
	{
		this.dragger.start(x, y);
	}
	
	if (this.rotating)
	{
		this.rotator.start(x, y);
	}
}

SB.Examples.DuckRider.prototype.onMouseUp = function(x, y)
{
	// console.log("Got delegate mouse up: " + x + ", " + y);
	if (this.dragging)
	{
		this.dragger.stop(x, y);
	}
	
	if (this.rotating)
	{
		this.rotator.stop(x, y);
	}
	
	if (this.lastdx || this.lastdy)
	{
		// set up a key frame starting at current rotatin and going around
		// bigger drag means faster spin
		var dx = this.lastdx;
		var dy  = this.lastdy;
		this.mover.setValue([0, 1],
				[{x: this.transform.position.x, y: this.transform.position.y },
				 {x: this.transform.position.x + dx * 10, 
					y: this.transform.position.y + dy * 10}
				 ]);
		this.mover.duration = SB.Examples.DuckRider.moveTime;
		this.mover.start();
	}
	
	if (this.lastrotate)
	{
		// set up a key frame starting at current rotatin and going around
		// bigger drag means faster spin
		var dy1 = this.lastrotate > 0 ? Math.PI : -Math.PI;
		var dy2  = dy1 * 2;
		this.spinner.setValue([0, .5, 1],
				[{y: this.transform.rotation.y },
				 {y: this.transform.rotation.y + dy1},
				 {y: this.transform.rotation.y + dy2},
				 ]);
		this.spinner.duration = SB.Examples.DuckRider.spinTime / Math.abs(this.lastrotate);
		this.spinner.start();
		                                   
	}
}

SB.Examples.DuckRider.prototype.onMouseScroll = function(delta)
{
	var zoomFactor = SB.Examples.DuckRider.zoomFactor;
	
	// console.log("Got delegate mouse scroll: " + delta);
	this.zoomer.zoom(delta > 0 ? zoomFactor : 1 / zoomFactor);
}	        

SB.Examples.DuckRider.prototype.onDraggerMove = function(dx, dy)
{
	dx *= .01;
	dy *= .01;
	
	this.transform.position.x += dx;
	this.transform.position.y += dy;
	
	if (dx)
		this.lastdx = dx;
	if (dy)
		this.lastdy = dy;
}

SB.Examples.DuckRider.prototype.onRotatorRotate = function(axis, delta)
{
	this.transform.rotation[axis] += delta;
	if (delta != 0)
		this.lastrotate = delta;
}

SB.Examples.DuckRider.prototype.onZoomerScale = function(x, y, z)
{
	this.transform.scale.x = x;
	this.transform.scale.y = y;
	this.transform.scale.z = z;
}

SB.Examples.DuckRider.prototype.onSpinnerValue = function(value)
{
	this.transform.rotation.y = value.y;
}

SB.Examples.DuckRider.prototype.onMoverValue = function(value)
{
	this.transform.position.x = value.x;
	this.transform.position.y = value.y;
}
	        
SB.Examples.DuckRider.highlightColor = 0xcc00cc;
SB.Examples.DuckRider.zoomFactor = 1.1666;
SB.Examples.DuckRider.spinTime = 1000;
SB.Examples.DuckRider.moveTime = 1000;
