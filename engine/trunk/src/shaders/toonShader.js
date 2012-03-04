goog.provide('SB.Shaders');

SB.Shaders = {} ;

SB.Shaders.ToonShader = function(diffuseUrl, toonUrl, ambient, diffuse)
{
	diffuse = diffuse || new THREE.Color( 0xFFFFFF );
	ambient = ambient || new THREE.Color( 0x050505 );

	var params = {	
		uniforms: 
			{
			"uDiffuseTexture" : { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture(diffuseUrl) },
			"uToonTexture"    : { type: "t", value: 1, texture: THREE.ImageUtils.loadTexture(toonUrl) },
			"specular": { type: "c", value: new THREE.Color( 0x333333 ) },
			"diffuse" : { type: "c", value: diffuse },
			"ambient" : { type: "c", value: ambient },
			"shininess"    : { type: "f", value: 30 },
			"ambientLightColor": { type: "c", value: new THREE.Color( 0x888888 ) }
			},

		vertexShader: document.getElementById('toonVertexShader').textContent,
		fragmentShader: document.getElementById('toonFragmentShader').textContent
	} ;
	
	return params;
} ;
