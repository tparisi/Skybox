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
	var material = null;
	if (this.param.materialType == SB.MaterialType.FromFile)
	{
		material = new THREE.MeshFaceMaterial(); // data.materials ? data.materials[0] : null;
		if (this.param.map)
		{
			for (var i = 0; i < data.materials.length; i++)
			{
				data.materials[i].map = this.param.map;
			}
		}
	}
	else
	{
		material = SB.Visual.realizeMaterial(this.param);
	}
	
	this.object = new THREE.Mesh(data, material);

	this.addToScene();
}

