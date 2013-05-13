

GlowEffect = function(param)
{
	param = param || {};
	
	var glowContainer = new SB.Entity(param);
	var transform = new SB.Transform({layer:SB.Graphics.instance.backgroundLayer});
	transform.position.z = - 3.667;
	
	glowContainer.addComponent(transform);
	
	var glowEffect = new SB.Entity(param);
	glowEffect.name = "I AM A GLOW EFFECT";
	transform = new SB.Transform();
	glowEffect.addComponent(transform);

	var GLOWMAP = THREE.ImageUtils.loadTexture("./images/green_glow_512.png");
	var NOISEMAP = THREE.ImageUtils.loadTexture("./images/cloud.png");
	var uniforms = {

			time: { type: "f", value: 1.0 },
			opacity: { type: "f", value: 1.0 },
			texture1: { type: "t", value: NOISEMAP },
			texture2: { type: "t", value: GLOWMAP }

		};

	uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
	uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

	var material = new THREE.ShaderMaterial( {

		uniforms: uniforms,
		vertexShader: document.getElementById( 'sbGlowVertexShader' ).textContent,
		fragmentShader: document.getElementById( 'sbGlowFragmentShader' ).textContent,
		transparent:true,
	} );
	
	uniforms2 = {
			time: { type: "f", value: 1.0 },
			resolution: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
		};

	material2 = new THREE.ShaderMaterial( {

		uniforms: uniforms2,
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent

	} );
	
	material3 = new THREE.MeshBasicMaterial({map:GLOWMAP, transparent:true});

	var pane = new SB.Pane( { width: 20, height: 10, material:material });
	
	glowEffect.addComponent(pane);
	glowContainer.addChild(glowEffect);	
	
	var glowEffectScript = new GlowEffectScript({effect:glowEffect, uniforms:uniforms});
	glowContainer.addComponent(glowEffectScript);
	
	var timer = new SB.Timer( { duration : 20000, loop: true } );

	glowContainer.addComponent(timer);

	timer.subscribe("time", glowEffectScript, glowEffectScript.onTimeChanged);
	timer.subscribe("fraction", glowEffectScript, glowEffectScript.onTimeFractionChanged);	
	timer.start();

	return glowContainer;
}

GlowEffectScript = function(param)
{
	param = param || {};
	this.effect = param.effect;
	this.uniforms = param.uniforms;	
	
	SB.Component.call(this, param);
}

goog.inherits(GlowEffectScript, SB.Component);

GlowEffectScript.prototype.realize = function(param)
{
	this.pane = this._entity.getComponent(SB.Pane);
	this.timer = this._entity.getComponent(SB.Timer);	
	this.transform = this._entity.getComponent(SB.Transform);
	this.effectTransform = this.effect.getComponent(SB.Transform);
	
	SB.Component.prototype.realize.call(this, param);
}

GlowEffectScript.prototype.update = function()
{
	SB.Component.prototype.update.call(this);
}

GlowEffectScript.prototype.onTimeChanged = function(t)
{
}

GlowEffectScript.prototype.onTimeFractionChanged = function(fraction)
{
	this.uniforms.time.value = fraction;
}
