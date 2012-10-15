/**
 * @fileoverview A visual containing a model in JSON format
 * @author Tony Parisi
 */
goog.provide('SB.JsonScene');
goog.require('SB.Model');
goog.require('SB.Shaders');
 
/**
 * @constructor
 * @extends {SB.Model}
 */
SB.JsonScene = function(param)
{
	SB.Model.call(this, param);
}

goog.inherits(SB.JsonScene, SB.Model);
	       
SB.JsonScene.prototype.handleLoaded = function(data)
{
	this.object = new THREE.Object3D();
	this.object.add(data.scene);
	
	this.addToScene();
}

SB.JsonScene.loadScene = function(url, param, callback)
{
	var scene = new SB.JsonScene(param);
	
	var loader = new THREE.SceneLoader;
	loader.load(url, function (data) {
		scene.handleLoaded(data);
		if (callback)
		{
			callback(scene);
		}
	});
	
	return scene;
}
