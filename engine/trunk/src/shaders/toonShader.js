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

		fragmentShader: [
			"uniform vec3 diffuse;",
			"uniform vec3 ambient;",
			"uniform vec3 specular;",
			"uniform float shininess;",
			"varying vec2 vUv;",
			"uniform sampler2D uDiffuseTexture;",
			"uniform sampler2D uToonTexture;",
			"uniform vec3 ambientLightColor;",
			"#if MAX_DIR_LIGHTS > 0",
			"uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];",
			"uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];",
			"#endif",
			"varying vec3 vViewPosition;",
			"varying vec3 vNormal;",

			"void main() {",

			"	vec3 normal = normalize( vNormal );",
			"	vec3 viewPosition = normalize( vViewPosition );",

			"	vec3 lightDir = normalize(vec3(1.0, 10.0, 0.0));",
			"	vec3 lightColor = vec3(1.0, 0.4, 0.4);",
				
			"	vec4 lDirection = viewMatrix * vec4( lightDir, 0.0 );",
			"	vec3 dirVector = normalize( lDirection.xyz );",
			"	vec3 dirHalfVector = normalize( lDirection.xyz + viewPosition );",
			"	float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );",
			"	float dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );",
			"	float dirSpecularWeight = pow( dirDotNormalHalf, shininess );",
				
			"	vec4 toonDiffuseWeight = texture2D(uToonTexture, vec2(dirDiffuseWeight, 0));",
			"	vec4 toonSpecularWeight = texture2D(uToonTexture, vec2(dirSpecularWeight, 0));",
			"	dirDiffuseWeight = toonDiffuseWeight.x;",
			"	dirSpecularWeight = toonSpecularWeight.x;",
			"	vec3 dirSpecular = specular * lightColor * dirSpecularWeight * dirDiffuseWeight;",
			"	vec3 dirDiffuse = diffuse * lightColor * dirDiffuseWeight;",

			"	gl_FragColor = vec4(( dirDiffuse + ambientLightColor * ambient ) + dirSpecular, 1.0);",
			"}"
		].join("\n"),
		
		vertexShader: [
			"varying vec3 vViewPosition;",
			"varying vec3 vNormal;",
			"varying vec2 vUv;",
			"uniform vec4 offsetRepeat;",

			"void main() {",
			"	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
			"	vUv = uv;",

			"	vViewPosition = -mvPosition.xyz;",
			"	vNormal = normalMatrix * normal;",

			"	gl_Position = projectionMatrix * mvPosition;",
			"}"
		].join("\n")

	} ;
	
	return params;
} ;
