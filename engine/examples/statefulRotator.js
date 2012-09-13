goog.provide('SB.Examples.StatefulRotator');
goog.require('SB.Component');
goog.require('SB.FSM');
goog.provide('SB.Examples.ClickedState');
goog.provide('SB.Examples.UnclickedState');
goog.provide('SB.Examples.DraggingState');

SB.Examples.StatefulRotator = function(param)
{

    // core services - maybe we move to service locator model?
    SB.Component.call(this, param);
} ;

goog.inherits(SB.Examples.StatefulRotator, SB.Component);

SB.Examples.StatefulRotator.prototype.realize = function()
{
	SB.Component.prototype.realize.call(this);
	
    this.target = (this.param && this.param.target) ? this.param.target : null;
    this.clickedState = new SB.Examples.ClickedState();
    this.unclickedState = new SB.Examples.UnclickedState();
    this.draggingState = new SB.Examples.DraggingState();

    this.fsm = new SB.FSM({state: this.unclickedState});

    this.lastState =
    {
        x : SB.Mouse.NO_POSITION, y: SB.Mouse.NO_POSITION,
        buttons : { left : false, middle : false, right : false },
        scroll : 0
    };

    this.rotateZ = false;
},

SB.Examples.StatefulRotator.prototype.update = function()
{
    var state = SB.Mouse.instance.getState();

    var dx = state.x - this.lastState.x;
    var dy = state.y - this.lastState.y;

    if (state.buttons.left)
    {
        if (dx < 2 && dy < 2 && this.lastState.buttons.left)
        {
        }
        else
        {
            this.draggingState.dy += dx * 0.01;
            this.draggingState.dz += dy * 0.01;
            this.fsm.changeState(this.draggingState, this);
        }
    }
    else
    {
        if (dx < 2 && dy < 2 && this.lastState.buttons.left)
        {
            this.fsm.changeState(this.clickedState, this);
        }
        else
        {
            this.fsm.changeState(this.unclickedState, this);
        }
    }

    this.lastState =
    {
        x : state.x, y: state.y,
        buttons : { left : state.buttons.left, middle : state.buttons.middle, right : state.buttons.right },
        scroll : state.scroll
    };

    this.fsm.update(this);
} ;

SB.Examples.ClickedState = function(param)
{
    this.init(param);
} ;

SB.Examples.ClickedState.prototype.init = function(param)
{
} ;

SB.Examples.ClickedState.prototype.enter = function(component)
{
	console.log("Entering state ClickedState");
	
    component.rotateZ = !component.rotateZ;
} ;

SB.Examples.ClickedState.prototype.exit = function(component)
{
	console.log("Exiting state ClickedState");
	
} ;

SB.Examples.ClickedState.prototype.execute = function(component)
{
} ;

SB.Examples.UnclickedState = function(param)
{
    this.init(param);
} ;
	        
SB.Examples.UnclickedState.prototype.init = function(param)
{
} ;

SB.Examples.UnclickedState.prototype.enter = function(component)
{
	console.log("Entering state UnclickedState");
	
} ;

SB.Examples.UnclickedState.prototype.exit = function(component)
{
	console.log("Exiting state UnclickedState");
	
} ;

SB.Examples.UnclickedState.prototype.execute = function(component)
{
} ;

SB.Examples.DraggingState = function(param)
{
    this.init(param);
} ;
	        
SB.Examples.DraggingState.prototype.init = function(param)
{
    this.dy = 0;
    this.dz = 0;

    console.log("Entering state DraggingState");
} ;

SB.Examples.DraggingState.prototype.enter = function(component)
{
} ;

SB.Examples.DraggingState.prototype.exit = function(component)
{
    console.log("Exiting state DraggingState");
} ;

SB.Examples.DraggingState.prototype.execute = function(component)
{
    if (!component.target)
    {
        return;
    }

    var axis = component.rotateZ ? 'z' : 'y';
    var delta = this.dy;
    component.target.rotation[axis] = delta;
} ;
