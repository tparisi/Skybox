goog.provide('SB.Shaders');

SB.Shaders = {} ;

SB.Shaders.ToonShader = function(diffuseUrl, toonUrl)
{
	var params = {	
		uniforms: 
			{
			"uDiffuseTexture" : { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture(diffuseUrl) },
			"uToonTexture"    : { type: "t", value: 1, texture: THREE.ImageUtils.loadTexture(toonUrl) },
			"specular": { type: "c", value: new THREE.Color( 0x111111 ) },
			"diffuse" : { type: "c", value: new THREE.Color( 0xFFFFFF ) },
			"ambient" : { type: "c", value: new THREE.Color( 0x050505 ) },
			"shininess"    : { type: "f", value: 30 }
			},

		vertexShader: document.getElementById('toonVertexShader').textContent,
		fragmentShader: document.getElementById('toonFragmentShader').textContent
	} ;
	
	return params;
} ;
