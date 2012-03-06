/**
 * @fileoverview A visual containing an arbitrary model
 * @author Tony Parisi
 */
goog.provide('SB.Model');
goog.require('SB.Visual');

/**
 * @constructor
 * @extends {SB.Visual}
 */
SB.Model = function(param)
{
    SB.Visual.call(this, param);

	this.frame = 0;
	this.animating = false;
	this.frameRate = SB.Model.default_frame_rate;
}

goog.inherits(SB.Model, SB.Visual);

SB.Model.prototype.animate  = function(animating)
{
	if (this.animating == animating)
	{
		return;
	}
	
	this.animating = animating;
	if (this.animating)
	{
		this.frame = 0;
		this.startTime = Date.now();
	}
}

SB.Model.default_frame_rate = 30;

SB.Model.loadModel = function(url, param, callback)
{
	var spliturl = url.split('.');
	var len = spliturl.length;
	var ext = '';
	if (len)
	{
		ext = spliturl[len - 1];
	}
	
	if (ext && ext.length)
	{
	}
	else
	{
		return;
	}
	
	var modelClass;
	var loaderClass;
	
	switch (ext.toUpperCase())
	{
		case 'DAE' :
			modelClass = SB.ColladaModel;
			loaderClass = THREE.ColladaLoader;
			break;
		case 'JS' :
			modelClass = SB.JsonModel;
			loaderClass = THREE.JSONLoader;
			break;
		default :
			break;
	}
	
	if (modelClass)
	{
		var model = new modelClass(param);
		
		var loader = new loaderClass;
		loader.load(url, function (data) {
			model.handleLoaded(data);
			if (callback)
			{
				callback(data);
			}
		});
		
		return model;
	}
}
