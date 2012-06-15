/**
 *
 */
goog.provide('SB.View');
goog.require('SB.PubSub');

SB.View = function(param)
{
	SB.PubSub.call(this);
	
	this.id = (param && param.id) ? param.id : "";
	this.closebox = (param && param.closebox) ? param.closebox : "";
	var style = (param && param.style) ? param.style : "";
	var elt = $('<div class="view ' + style + '" id = "' + this.id + '">');
	this.dom = elt[0];
	var sb = { object: this };
	this.dom.SB = sb;
	document.body.appendChild(this.dom);

}
        
goog.inherits(SB.View, SB.PubSub);

SB.View.prototype.handleLoaded = function(html)
{
	this.dom.innerHTML = html;
	this.build();
},

SB.View.prototype.build = function()
{
	if (this.closebox)
	{
    	var closeboxwidget = $(
    	"<div class='closebox'><img id='closebox' src='./images/closebox-gray.png' width='16px' height='16px'></img></div>");
	 
    	var closeboxdiv;
    	
    	if (closeboxwidget)
    	{
    		closeboxdiv = closeboxwidget[0];
    	}
	
    	if (closeboxdiv)
    	{
    		var firstchild = this.dom.firstChild;
    		if (firstchild)
    		{
    			this.dom.insertBefore(closeboxdiv, firstchild);
    		}
    		else
    		{
    			this.dom.appendChild(closeboxdiv);
    		}
    		
    		var that = this;
    		closeboxdiv.addEventListener('click', function(event) { that.onCloseBoxClick(); }, false);
    	}	
	}
}

SB.View.prototype.show  = function()
{
	this.dom.style.display = 'block';

	var width = $(this.dom).width();
	var left = (window.innerWidth - width) / 2;

	this.dom.style.left = left + 'px';
	
}

SB.View.prototype.hide  = function()
{
	this.dom.style.display = 'none';
}

SB.View.prototype.onCloseBoxClick = function()
{
	this.hide();
}
        
/* statics */        
        
SB.View.close = function(target)
{
	var elt = SB.View.findViewFromElement(target);
	if (elt)
	{
		var view = elt.SB.object;
		view.hide();
	}
}
    	
SB.View.findViewFromElement = function(target)
{
	if (target.SB)
		return target;
	else if (target.parentNode)
		return  SB.View.findViewFromElement(target.parentNode);
	else
		return null;
}