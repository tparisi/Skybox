Gabber = function(param)
{
	SB.Entity.call(this, param);
	
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

	this.picker = new SB.Picker();
	this.rotator = new SB.Rotator();
	this.dragger = new SB.Dragger();
	this.zoomer = new SB.Zoomer();
	this.mover = new SB.KeyFrame({ loop : false, easeOut : true });
	this.spinner = new SB.KeyFrame({ loop : true, easeOut : false });
	this.timer = new SB.Timer( { duration : 3333 } );
	this.screenTracker = new SB.ScreenTracker( { referencePosition : new THREE.Vector3(1, 3.667, 0) });
	
	this.addComponent(this.transform);
	this.addComponent(this.body);
	this.addComponent(this.display);
	this.addComponent(this.displayFrame);
	this.addComponent(this.picker);
	this.addComponent(this.rotator);
	this.addComponent(this.dragger);
	this.addComponent(this.zoomer);
	this.addComponent(this.spinner);
	this.addComponent(this.mover);
	this.addComponent(this.timer);
	this.addComponent(this.screenTracker);

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
	
	this.timer.subscribe("time", this, this.onTimeChanged);
	this.timer.subscribe("fraction", this, this.onTimeFractionChanged);
	
	this.screenTracker.subscribe("position", this, this.onScreenPositionChanged);
	
	this.dragging = true;
	this.rotating = true;
	this.whichKeyDown = 0;
	this.turnFraction = 0;
	
	this.savedColor = null;
	
	this.monsterID = Gabber.monsterID++;
	this.annotation = new SB.Annotation( { style : "text300" } );
	this.annotation.setHTML("@" + param.name);
	// this.annotation.show();
}

goog.inherits(Gabber, SB.Entity);

Gabber.prototype.realize = function() 
{
	SB.Entity.prototype.realize.call(this);
	this.screenTracker.start();
}


Gabber.prototype.onModelLoaded = function(model)
{
	if (model)
	{
		model.applyShader(SB.Shaders.ToonShader);
	}
}

Gabber.prototype.onMouseOver = function(x, y)
{
}

Gabber.prototype.onMouseOut = function(x, y)
{
}
	        
Gabber.prototype.onMouseMove = function(x, y)
{
	if (this.dragging)
	{
		this.dragger.set(x, y);
	}
	
	if (this.rotating)
	{
		this.rotator.set(x, y);
	}
}

Gabber.prototype.onMouseDown = function(x, y)
{
	this.spinner.stop();
	this.lastrotate = 0;
	this.lastdx = this.lastdy = 0;
	
	if (this.dragging)
	{
		this.dragger.start(x, y);
	}
	
	if (this.rotating)
	{
		this.rotator.start(x, y);
	}
	
}

Gabber.prototype.onMouseUp = function(x, y)
{
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
		this.mover.duration = Gabber.moveTime;
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
		this.spinner.duration = Gabber.spinTime / Math.abs(this.lastrotate);
		this.spinner.start();
		                                   
	}

	if (!this.lastdx && !this.lastdy)
	{
		this.model.animate(!this.model.animating);
	}
}

Gabber.prototype.onMouseScroll = function(delta)
{
	var zoomFactor = Gabber.zoomFactor;
	
	this.zoomer.zoom(delta > 0 ? zoomFactor : 1 / zoomFactor);
}	        

Gabber.prototype.onDraggerMove  = function(dx, dy)
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

Gabber.prototype.onRotatorRotate  = function(axis, delta)
{
	this.transform.rotation[axis] += delta;
	if (delta != 0)
		this.lastrotate = delta;
}

Gabber.prototype.onZoomerScale  = function(x, y, z)
{
	this.transform.scale.x = x;
	this.transform.scale.y = y;
	this.transform.scale.z = z;
}

Gabber.prototype.onSpinnerValue  = function(value)
{
	this.transform.rotation.y = value.y;
}

Gabber.prototype.onMoverValue = function(value)
{
	this.transform.position.x = value.x;
	this.transform.position.y = value.y;
}

Gabber.prototype.onTimeChanged = function(t)
{
	switch (this.whichKeyDown)
	{
    	case SB.Keyboard.KEY_LEFT : 
			this.turn(+1);
    		break;
    	case SB.Keyboard.KEY_UP : 
			this.move(-1);
    		break;
    	case SB.Keyboard.KEY_RIGHT : 
    		this.turn(-1);
    		break;
    	case SB.Keyboard.KEY_DOWN : 
    			this.move(+1);
    		break;
	}
}

Gabber.prototype.onTimeFractionChanged = function(fraction)
{
	this.turnFraction = fraction;
}

Gabber.prototype.onKeyDown = function(keyCode, charCode)
{
	this.whichKeyDown = keyCode;
}

Gabber.prototype.onKeyUp = function(keyCode, charCode)
{
	this.whichKeyDown = 0;
	this.turnFraction = 0;
}

Gabber.prototype.setActive = function(active)
{
	this.model.animate(active);
	this.active = active;
	if (this.active)
	{
		this.timer.start();
	}
	else
	{
		this.timer.stop();
	}
}

Gabber.prototype.move = function(direction)
{
	var delta = direction * .1666;
	var dir = new THREE.Vector3(0, 0, delta);
	var matrix = new THREE.Matrix4();
	matrix.setRotationY(this.transform.rotation.y - Math.PI / 2);
	dir.applyMatrix4(matrix);
	this.transform.position.add(dir);
}

Gabber.prototype.turn = function(direction)
{
	var delta = direction * .0333;
	this.transform.rotation.y += delta;
//	var delta = direction * this.turnFraction * (Math.PI * 2); // .0333;
//	this.transform.rotation.y = delta; // += delta;
}

Gabber.prototype.onScreenPositionChanged = function(pos)
{
	// console.log("Z = " + pos.z);

	this.annotation.setPosition(pos);
	if (pos.z < 0 && this.annotation.visible)
	{
		this.annotation.hide();
	}
	else if (pos.z >= 0 && !this.annotation.visible)
	{
		this.annotation.show();
	}
}

Gabber.highlightColor = 0xcc00cc;
Gabber.zoomFactor = 1.1666;
Gabber.spinTime = 1000;
Gabber.moveTime = 1000;
Gabber.monsterID = 0;
