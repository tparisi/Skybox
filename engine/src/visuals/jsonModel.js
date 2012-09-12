/**
 * @fileoverview A visual containing a model in JSON format
 * @author Tony Parisi
 */
goog.provide('SB.JsonModel');
goog.require('SB.Model');
goog.require('SB.Shaders');
 
/**
 * @constructor
 * @extends {SB.Model}
 */
SB.JsonModel = function(param)
{
	SB.Model.call(this, param);
}

goog.inherits(SB.JsonModel, SB.Model);
	       
SB.JsonModel.prototype.handleLoaded = function(data)
{
	var material = new THREE.MeshFaceMaterial(); // data.materials ? data.materials[0] : null;
	
	this.object = new THREE.Mesh(data, material);

	this.addToScene();
}

