/**
 * @fileoverview Loader - loads level files
 * 
 * @author Tony Parisi
 */

goog.provide('SB.Loader');
goog.require('SB.PubSub');

/**
 * @constructor
 * @extends {SB.PubSub}
 */
SB.Loader = function()
{
    SB.PubSub.call(this);	
}

goog.inherits(SB.Loader, SB.PubSub);
        
SB.Loader.prototype.loadScene = function(url)
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
	
	var loaderClass;
	
	switch (ext.toUpperCase())
	{
		case 'DAE' :
			loaderClass = THREE.ColladaLoader;
			break;
		case 'JS' :
			loaderClass = THREE.SceneLoader;
			break;
		default :
			break;
	}
	
	if (loaderClass)
	{
		var loader = new loaderClass;
		var that = this;
		
		loader.load(url, function (data) {
			that.handleSceneLoaded(url, data);
		});		
	}
}

SB.Loader.prototype.handleSceneLoaded = function(url, data)
{
	var result = {};
	var success = false;
	
	if (data.scene)
	{
		result.scene = new SB.SceneVisual({scene:data.scene});
		success = true;
	}
	
	if (data.skins)
	{
		result.animator = new SB.MeshAnimator({skins:data.skins});
	}
	
	if (success)
		this.publish("loaded", result);
}
