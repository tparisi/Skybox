
goog.provide('SB.Picker');
goog.require('SB.Component');

SB.Picker = function(param) {
    SB.Component.call(this, param);

    // this.post = true; // these messages get posted to sim queue since they're async, kinda
}

goog.inherits(SB.Picker, SB.Component);

SB.Picker.prototype.realize = function()
{
	SB.Component.prototype.realize.call(this);
	
	this.overCursor = this.param.overCursor;
	
	if (this._entity)
	{
		var object = this._entity.transform;
		if (object)
		{
			object.picker = this;
		}
	}
}

SB.Picker.prototype.update = function()
{
}

SB.Picker.prototype.onMouseOver = function(x, y)
{
    this.publish("mouseOver", x, y);
}

SB.Picker.prototype.onMouseOut = function(x, y)
{
    this.publish("mouseOut", x, y);
}
	        	        
SB.Picker.prototype.onMouseMove = function(x, y)
{
    this.publish("mouseMove", x, y);
}

SB.Picker.prototype.onMouseDown = function(x, y)
{
    this.publish("mouseDown", x, y);
}

SB.Picker.prototype.onMouseUp = function(x, y)
{
    this.publish("mouseUp", x, y);
}
	        
SB.Picker.prototype.onMouseScroll = function(delta)
{
    this.publish("mouseScroll", delta);
}

SB.Picker.handleMouseMove = function(x, y)
{
    // console.log("PICKER Mouse move " + x + ", " + y);

    if (SB.Picker.clickedObject && SB.Picker.clickedObject.onMouseMove)
    {
        SB.Picker.clickedObject.onMouseMove(x, y);
    }
    else
    {
        var oldObj = SB.Picker.overObject;
        SB.Picker.overObject = SB.Picker.objectFromMouse(x, y);

        if (SB.Picker.overObject != oldObj)
        {
    		if (oldObj)
    		{
    			SB.Graphics.instance.setCursor('auto');
    			
    			if (oldObj.onMouseOut)
                {
                    oldObj.onMouseOut(x, y);
                }
    		}

            if (SB.Picker.overObject)
            {            	
	        	if (SB.Picker.overObject.overCursor)
	        	{
	        		SB.Graphics.instance.setCursor(SB.Picker.overObject.overCursor);
	        	}
	        	
	        	if (SB.Picker.overObject.onMouseOver)
	        	{
	        		SB.Picker.overObject.onMouseOver(x, y);
	        	}
            }
        }
    }
}

SB.Picker.handleMouseDown = function(x, y)
{
    // console.log("PICKER Mouse down " + x + ", " + y);

    SB.Picker.clickedObject = SB.Picker.objectFromMouse(x, y);
    if (SB.Picker.clickedObject && SB.Picker.clickedObject.onMouseDown)
    {
        SB.Picker.clickedObject.onMouseDown(x, y);
    }
}

SB.Picker.handleMouseUp = function(x, y)
{
    // console.log("PICKER Mouse up " + x + ", " + y);

    if (SB.Picker.clickedObject && SB.Picker.clickedObject.onMouseUp)
    {
        SB.Picker.clickedObject.onMouseUp(x, y);
    }

    SB.Picker.clickedObject = null;
}

SB.Picker.handleMouseScroll = function(delta)
{
    // console.log("PICKER Mouse up " + x + ", " + y);

    if (SB.Picker.overObject && SB.Picker.overObject.onMouseScroll)
    {
        SB.Picker.overObject.onMouseScroll(delta);
    }

    SB.Picker.clickedObject = null;
}

SB.Picker.objectFromMouse = function(x, y)
{
	var intersected = SB.Graphics.instance.objectFromMouse(x, y);
	if (intersected.object)
	{
    	if (intersected.object.picker)
    	{
    		return intersected.object.picker;
    	}
    	else
    	{
    		return SB.Picker.findObjectPicker(intersected.object.object);
    	}
	}
	else
	{
		return null;
	}
}

SB.Picker.findObjectPicker = function(object)
{
	while (object)
	{
		if (object.data && object.data.picker)
		{
			return object.data.picker;
		}
		else
		{
			object = object.parent;
		}
	}
	
	return null;
}


SB.Picker.clickedObject = null;
SB.Picker.overObject  =  null;
