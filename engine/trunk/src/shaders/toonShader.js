goog.provide('SB.Shaders');

SB.Shaders = {} ;

SB.Shaders.ToonShader = function(diffuseUrl, toonUrl)
{
	var params = {	
		uniforms: THREE.UniformsUtils.merge( [
			THREE.UniformsLib[ "lights" ],
			
			{
			"uDiffuseTexture" : { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture(diffuseUrl) },
			"uToonTexture"    : { type: "t", value: 1, texture: THREE.ImageUtils.loadTexture(toonUrl) },

			"uSpecularColor": { type: "c", value: new THREE.Color( 0x111111 ) },
			"uDiffuseColor" : { type: "c", value: new THREE.Color( 0xFFFFFF ) },
			"uAmbientColor" : { type: "c", value: new THREE.Color( 0x050505 ) },
			"uShininess"    : { type: "f", value: 30 }
			}

		] ),

		vertexShader: document.getElementById('toonVertexShader').textContent,
		fragmentShader: document.getElementById('toonFragmentShader').textContent
	} ;
	
	return params;
} ;
