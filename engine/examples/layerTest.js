SB.Examples.LayerTest = function()
{
	SB.Game.call(this);	    	
}

goog.inherits(SB.Examples.LayerTest, SB.Game);

SB.Examples.LayerTest.prototype.initialize = function(param)
{
	param.backgroundColor = '#000000';
	SB.Game.prototype.initialize.call(this, param);

	var root = new SB.Entity;
	
	/*
	var GLOWMAP = THREE.ImageUtils.loadTexture("./images/green_glow_512.png");
	var NOISEMAP = THREE.ImageUtils.loadTexture("./images/cloud.png");
	var uniforms = {

			time: { type: "f", value: 1.0 },
			opacity: { type: "f", value: 1.0 },
			texture1: { type: "t", value: 0, texture: NOISEMAP },
			texture2: { type: "t", value: 1, texture: GLOWMAP }

		};

	uniforms.texture1.texture.wrapS = uniforms.texture1.texture.wrapT = THREE.Repeat;
	uniforms.texture2.texture.wrapS = uniforms.texture2.texture.wrapT = THREE.Repeat;

    var material = new THREE.ShaderMaterial( {

		uniforms: uniforms,
		vertexShader: document.getElementById( 'sbGlowVertexShader' ).textContent,
		fragmentShader: document.getElementById( 'sbGlowFragmentShader' ).textContent,
		transparent:true,
	} );
	*/
    
	var e = new SB.Entity;
	var transform = new SB.Transform;
	e.addComponent(transform);
	var map = THREE.ImageUtils.loadTexture('./images/duckCM.png');
	var cube = new SB.CubeVisual({map:map});
	e.addComponent(cube);
	
	root.addChild(e);
	
	var b1 = new SB.Examples.LayerObject();
	//b1.transform.position.x = 2;
	
	var headlight = new SB.DirectionalLight({ /*layer:SB.Graphics.instance.backgroundLayer,*/ color : 0xFFFFFF, intensity : 1});
    root.addComponent(headlight);

	var headlight = new SB.DirectionalLight({layer:SB.Graphics.instance.backgroundLayer, color : 0xFFFFFF, intensity : 1});
    root.addComponent(headlight);
    
	root.addChild(b1);

	var glowEffect = GlowEffect({viewer:this});
	this.addEntity(glowEffect);
	glowEffect.realize();
	
	this.addEntity(root);

	root.realize();

}

