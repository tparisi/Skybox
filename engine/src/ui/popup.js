/**
 *
 */
goog.provide('SB.Popup');
goog.require('SB.View');

SB.Popup = function(param)
{
	param.style = "popup";
    SB.View.call(this, param);
	
	SB.Popup.stack = [];
}

goog.inherits(SB.Popup, SB.View);

SB.Popup.prototype.show = function()
{
	SB.View.prototype.show.call(this);
	
	SB.Popup.push(this);
}

SB.Popup.prototype.hide = function()
{
	SB.View.prototype.hide.call(this);
	
	SB.Popup.pop(this);
}        

SB.Popup.stack = null;
    	
SB.Popup.push = function(popup)
{
	SB.Popup.stack.push(popup);
}

SB.Popup.pop = function(popup)
{
	var len = SB.Popup.stack.length;
	if (len)
	{
		var top = SB.Popup.stack[len - 1];
		if (top && top == popup)
		{
        	return SB.Popup.stack.pop();
		}
	}
}
