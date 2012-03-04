/**
 * @fileoverview A visual containing a model in JSON format
 * @author Don Olmstead
 */
goog.provide('SB.JsonModel');
goog.require('SB.Model');
 
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
	this.object = new THREE.Mesh(data, SB.Visual.realizeMaterial(this.param));
	
	this.addToScene();
}
