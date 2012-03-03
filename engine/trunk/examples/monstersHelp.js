SB.Examples.MonstersHelp = function(param)
{
	
	if (!param)
	{
		param = {};
	}
	param.id = "MonstersHelp";
	param.closebox = true;
	
	SB.Popup.call(this, param);
	
	var that = this;
	SB.File.loadFile('./monstersHelp.html?dt=' + Date.now(), function(html) { that.handleLoaded(html); });
}

goog.inherits(SB.Examples.MonstersHelp, SB.Popup);
