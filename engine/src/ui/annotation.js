/**
 *
 */
goog.provide('SB.Annotation');
goog.require('SB.PubSub');

SB.Annotation = function(param)
{
	SB.PubSub.call(this);
	
	this.id = (param && param.id) ? param.id : "";
	var style = (param && param.style) ? param.style : "";
	var elt = $('<div class="annotation ' + style + '" id = "' + this.id + '">');
	this.dom = elt[0];
	document.body.appendChild(this.dom);

	param = param || {};
	if (param.html)
	{
		this.setHTML(html);
	}
	
	this.visible = param.visible || false;
	if (this.visible)
	{
		this.show();
	}
}
        
goog.inherits(SB.Annotation, SB.PubSub);

SB.Annotation.prototype.setHTML = function(html)
{
	this.dom.innerHTML = html;
}

SB.Annotation.prototype.setPosition = function(pos)
{
	var width = this.dom.offsetWidth;
	var height = this.dom.offsetHeight;
	
	var newpos = pos.clone();
	newpos.x -= width / 2;
	newpos.y -= height / 2;
	
	this.dom.style.left = newpos.x + "px";
	this.dom.style.top = newpos.y + "px";
}

SB.Annotation.prototype.show  = function()
{
	this.dom.style.display = 'block';
	this.visible = true;
}

SB.Annotation.prototype.hide  = function()
{
	this.dom.style.display = 'none';
	this.visible = false;
}

