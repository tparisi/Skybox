/**
 * @fileoverview A visual containing a model in JSON format
 * @author Don Olmstead
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
	}
	else
	{
		material = SB.Visual.realizeMaterial(this.param);
	}

	// HACK FOR TOON SHADING REMOVE
	var diffuseTexture = './images/diffuse-tree.png';
	var toonTexture = './images/toon-lookup.png';
	
	for (var i = 0; i < data.materials.length; i++)
	{
		var oldMaterial = data.materials[i];
		
		var newMaterialParams = SB.Shaders.ToonShader(diffuseTexture, toonTexture, oldMaterial.ambient, oldMaterial.color);
		
		data.materials[i] = new THREE.ShaderMaterial(newMaterialParams);
	}

	this.object = new THREE.Mesh(data, material);
	
	this.addToScene();
}
