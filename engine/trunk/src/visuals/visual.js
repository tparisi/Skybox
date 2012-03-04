/**
 * @fileoverview Base class for visual elements.
 * @author Tony Parisi
 */
goog.provide('SB.Visual');
goog.require('SB.SceneComponent');

/**
 * Enum for different material types.
 * @enum {number}
 */
SB.MaterialType = {
	Shader: 0,
	Phong: 1,
	Basic: 2
} ;

/**
 * @constructor
 */
SB.Visual = function(param) {
	
	SB.SceneComponent.call(this);
	
} ;

/**
 * 
 */
SB.Visual.realizeMaterial = function(param)
{
	if (!param.materialType)
	{
		param.materialType = SB.MaterialType.Basic;
		
		param.materialParam = {
			color: 0x262624,
			wireframe: false
		} ;
	}
	
	switch (param.materialType)
	{
		case SB.MaterialType.Shader:
			return new THREE.MeshShaderMaterial(param.materialParam);
		case SB.MaterialType.Phong:
			return new THREE.MeshPhongMaterial(param.materialParam);
		default:
			return new THREE.MeshBasicMaterial(param.materialParam);
	} ;
} ;

goog.inherits(SB.Visual, SB.SceneComponent);
