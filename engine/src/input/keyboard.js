/**
 *
 */
goog.provide('SB.Keyboard');

SB.Keyboard = function()
{
	// N.B.: freak out if somebody tries to make 2
	// throw (...)

	SB.Keyboard.instance = this;
}

SB.Keyboard.prototype.onKeyDown = function(keyCode, charCode)
{
}

SB.Keyboard.prototype.onKeyUp = function(keyCode, charCode)
{
}

SB.Keyboard.prototype.onKeyPress = function(keyCode, charCode)
{
}	        

SB.Keyboard.instance = null;

/* key codes
37: left
38: up
39: right
40: down
*/
SB.Keyboard.KEY_LEFT  = 37;
SB.Keyboard.KEY_UP  = 38;
SB.Keyboard.KEY_RIGHT  = 39;
SB.Keyboard.KEY_DOWN  = 40;
