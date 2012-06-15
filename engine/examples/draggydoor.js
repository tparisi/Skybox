goog.provide('SB.Examples.DraggyDoor');
goog.require('SB.Entity');
goog.require('SB.Picker');
goog.require('SB.Pane');
goog.require('SB.Dragger');
goog.require('SB.Zoomer');

SB.Examples.DraggyDoor = function()
{
    SB.Entity.call(this);
    this.transform = new SB.Transform();
    this.pane = new SB.Pane();
    this.picker = new SB.Picker();
    this.rotator = new SB.Rotator();
    this.dragger = new SB.Dragger();
    this.zoomer = new SB.Zoomer();

    this.addComponent(this.transform);
    this.addComponent(this.pane);
    this.addComponent(this.picker);
    this.addComponent(this.rotator);
    this.addComponent(this.dragger);
    this.addComponent(this.zoomer);

    this.dragger.subscribe("move", this, this.onDraggerMove);
    this.rotator.subscribe("rotate", this, this.onRotatorRotate);
    this.zoomer.subscribe("scale", this, this.onZoomerScale);
    this.picker.subscribe("mouseOver", this, this.onMouseOver);
    this.picker.subscribe("mouseOut", this, this.onMouseOut);
    this.picker.subscribe("mouseMove", this, this.onMouseMove);
    this.picker.subscribe("mouseDown", this, this.onMouseDown);
    this.picker.subscribe("mouseUp", this, this.onMouseUp);
    this.picker.subscribe("mouseScroll", this, this.onMouseScroll);

    this.dragging = true;
    this.rotating = true;

    this.savedColor = null;
} ;

goog.inherits(SB.Examples.DraggyDoor, SB.Entity);

SB.Examples.DraggyDoor.prototype.onMouseOver = function(x, y)
{
    // console.log("Got delegate mouse over: " + x + ", " + y);
    this.savedColor = this.pane.object.materials[0].color.getHex();
    this.pane.object.materials[0].color.setHex(SB.Examples.DraggyDoor.highlightColor);
} ;

SB.Examples.DraggyDoor.prototype.onMouseOut = function(x, y)
{
    // console.log("Got delegate mouse out: " + x + ", " + y);
    this.pane.object.materials[0].color.setHex(this.savedColor);
} ;

SB.Examples.DraggyDoor.prototype.onMouseMove = function(x, y)
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
} ;

SB.Examples.DraggyDoor.prototype.onMouseDown = function(x, y)
{
    // console.log("Got delegate mouse down: " + x + ", " + y);
    if (this.dragging)
    {
        this.dragger.start(x, y);
    }

    if (this.rotating)
    {
        this.rotator.start(x, y);
    }
} ;

SB.Examples.DraggyDoor.prototype.onMouseUp = function(x, y)
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
} ;

SB.Examples.DraggyDoor.prototype.onMouseScroll = function(delta)
{
    var zoomFactor = SB.Examples.DraggyDoor.zoomFactor;

    // console.log("Got delegate mouse scroll: " + delta);
    this.zoomer.zoom(delta > 0 ? zoomFactor : 1 / zoomFactor);
} ;

SB.Examples.DraggyDoor.prototype.onDraggerMove = function(dx, dy)
{
	dx *= .01;
	dy *= .01;

	this.pane.position.x += dx;
    this.pane.position.y += dy;
} ;

SB.Examples.DraggyDoor.prototype.onRotatorRotate = function(axis, delta)
{
    this.pane.rotation[axis] += delta;
} ;

SB.Examples.DraggyDoor.prototype.onZoomerScale = function(x, y, z)
{
    this.pane.scale.x = x;
    this.pane.scale.y = y;
    this.pane.scale.z = z;
} ;

SB.Examples.DraggyDoor.highlightColor = 0xcc00cc;
SB.Examples.DraggyDoor.zoomFactor = 1.1666;