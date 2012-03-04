goog.provide('SB.Shaders');

SB.Shaders.ToonShader = 
{

	uniforms: THREE.UniformsUtils.merge( [
		THREE.UniformsLib[ "lights" ],
		
		{
		"uDiffuseTexture" : { type: "t", value: 0, texture: null },
		"uToonTexture"    : { type: "t", value: 1, texture: null }

		"uSpecularColor": { type: "c", value: new THREE.Color( 0x111111 ) },
		"uAmbientColor": { type: "c", value: new THREE.Color( 0x050505 ) },
		}

	] ),

	vertexShader: document.getElementById('toonVertexShader').textContent,
	fragmentShader: document.getElementById('toonFragmenShader').textContent
} ;
