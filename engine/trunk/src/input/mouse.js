/**
 *
 */
goog.provide('SB.Mouse');

SB.Mouse = function()
{
	// N.B.: freak out if somebody tries to make 2
	// throw (...)

	this.state = 
	{ x : SB.Mouse.NO_POSITION, y: SB.Mouse.NO_POSITION,

	buttons : { left : false, middle : false, right : false },
	scroll : 0,
	};

	SB.Mouse.instance = this;
};

SB.Mouse.prototype.onMouseMove = function(x, y)
{
    this.state.x = x;
    this.state.y = y;	            
}

SB.Mouse.prototype.onMouseDown = function(x, y)
{
    this.state.x = x;
    this.state.y = y;
    this.state.buttons.left = true;
}

SB.Mouse.prototype.onMouseUp = function(x, y)
{
    this.state.x = x;
    this.state.y = y;
    this.state.buttons.left = false;	            
}

SB.Mouse.prototype.onMouseScroll = function(event, delta)
{
    this.state.scroll = 0; // PUNT!
}


SB.Mouse.prototype.getState = function()
{
	return this.state;
}

SB.Mouse.instance = null;
SB.Mouse.NO_POSITION = Number.MIN_VALUE;
