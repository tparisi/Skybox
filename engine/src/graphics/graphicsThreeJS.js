/**
 * @fileoverview Main interface to the graphics and rendering subsystem
 * 
 * @author Tony Parisi
 */
goog.require('SB.Graphics');
goog.provide('SB.GraphicsThreeJS');

SB.GraphicsThreeJS = function()
{
	SB.Graphics.call(this);
}

goog.inherits(SB.GraphicsThreeJS, SB.Graphics);

SB.GraphicsThreeJS.prototype.initialize = function(param)
{
	param = param || {};
	
	// call all the setup functions
	this.initOptions(param);
	this.initPageElements(param);
	this.initScene();
	this.initRenderer(param);
	this.initMouse();
	this.initKeyboard();
	this.addDomHandlers();
}

SB.GraphicsThreeJS.prototype.focus = function()
{
	if (this.renderer && this.renderer.domElement)
	{
		this.renderer.domElement.focus();
	}
}

SB.GraphicsThreeJS.prototype.initOptions = function(param)
{
	this.displayStats = (param && param.displayStats) ? 
			param.displayStats : SB.GraphicsThreeJS.default_display_stats;
}

SB.GraphicsThreeJS.prototype.initPageElements = function(param)
{
    if (param.container)
    {
    	this.container = param.container;
    }
   	else
   	{
		this.container = document.createElement( 'div' );
	    document.body.appendChild( this.container );
   	}

    this.saved_cursor = this.container.style.cursor;
    
    if (this.displayStats)
    {
        var stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.left = '140px';
        stats.domElement.style.height = '40px';
        this.container.appendChild( stats.domElement );
        this.stats = stats;
    }
}

SB.GraphicsThreeJS.prototype.initScene = function()
{
    var scene = new THREE.Scene();

//    scene.add( new THREE.AmbientLight(0xffffff) ); //  0x505050 ) ); // 
	
    var camera = new THREE.PerspectiveCamera( 45, 
    		this.container.offsetWidth / this.container.offsetHeight, 1, 4000 );
    camera.position.set( 0, 0, 10 );

    scene.add(camera);
    
    this.scene = scene;
	this.camera = camera;
	
	this.backgroundLayer = {};
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 45, 
    		this.container.offsetWidth / this.container.offsetHeight, 1, 4000 );
    camera.position.set( 0, 0, 10 );	
    scene.add(camera);
    
    this.backgroundLayer.scene = scene;
    this.backgroundLayer.camera = camera;
}

SB.GraphicsThreeJS.prototype.initRenderer = function(param)
{
    var renderer = SB.Config.USE_WEBGL ?
    	new THREE.WebGLRenderer( { antialias: true } ) :
    	new THREE.CanvasRenderer;
    	
    renderer.sortObjects = false;
    renderer.setSize( this.container.offsetWidth, this.container.offsetHeight );

    if (param && param.backgroundColor)
    {
    	renderer.domElement.style.backgroundColor = param.backgroundColor;
    	renderer.domElement.setAttribute('z-index', -1);
    }
    
    this.container.appendChild( renderer.domElement );

    var projector = new THREE.Projector();

    this.renderer = renderer;
    this.projector = projector;

    this.lastFrameTime = 0;
}

SB.GraphicsThreeJS.prototype.initMouse = function()
{
	var dom = this.renderer.domElement;
	
	var that = this;
	dom.addEventListener( 'mousemove', 
			function(e) { that.onDocumentMouseMove(e); }, false );
	dom.addEventListener( 'mousedown', 
			function(e) { that.onDocumentMouseDown(e); }, false );
	dom.addEventListener( 'mouseup', 
			function(e) { that.onDocumentMouseUp(e); }, false );
	
	$(dom).mousewheel(
	        function(e, delta) {
	            that.onDocumentMouseScroll(e, delta);
	        }
	    );
	
}

SB.GraphicsThreeJS.prototype.initKeyboard = function()
{
	var dom = this.renderer.domElement;
	
	var that = this;
	dom.addEventListener( 'keydown', 
			function(e) { that.onKeyDown(e); }, false );
	dom.addEventListener( 'keyup', 
			function(e) { that.onKeyUp(e); }, false );
	dom.addEventListener( 'keypress', 
			function(e) { that.onKeyPress(e); }, false );

	// so it can take focus
	dom.setAttribute("tabindex", 1);
    
}

SB.GraphicsThreeJS.prototype.addDomHandlers = function()
{
	var that = this;
	window.addEventListener( 'resize', function(event) { that.onWindowResize(event); }, false );
}

SB.GraphicsThreeJS.prototype.objectFromMouse = function(eltx, elty)
{
	// translate client coords into vp x,y
    var vpx = ( eltx / this.container.offsetWidth ) * 2 - 1;
    var vpy = - ( elty / this.container.offsetHeight ) * 2 + 1;
    
    var vector = new THREE.Vector3( vpx, vpy, 0.5 );

    this.projector.unprojectVector( vector, this.camera );
	
    var pos = new THREE.Vector3;
    pos = this.camera.matrixWorld.multiplyVector3(pos);
    var ray = new THREE.Ray( pos, vector.subSelf( pos ).normalize() );

    var intersects = ray.intersectObject( this.scene, true );
	
    if ( intersects.length > 0 ) {
    	var i = 0;
    	while(!intersects[i].object.visible)
    	{
    		i++;
    	}
    	
    	var intersected = intersects[i];
    	
    	if (i >= intersects.length)
    	{
        	return { object : null, point : null, normal : null };
    	}
    	
    	return (this.findObjectFromIntersected(intersected.object, intersected.point, intersected.face.normal));        	    	                             
    }
    else
    {
    	return { object : null, point : null, normal : null };
    }
}

SB.GraphicsThreeJS.prototype.findObjectFromIntersected = function(object, point, normal)
{
	if (object.data)
	{
		return { object: object.data, point: point, normal: normal };
	}
	else if (object.parent)
	{
		return this.findObjectFromIntersected(object.parent, point, normal);
	}
	else
	{
		return { object : null, point : null, normal : null };
	}
}

SB.GraphicsThreeJS.prototype.nodeFromMouse = function(eltx, elty)
{
	// Blerg, this is to support code outside the SB components & picker framework
	// Returns a raw Three.js node
	
	// translate client coords into vp x,y
    var vpx = ( eltx / this.container.offsetWidth ) * 2 - 1;
    var vpy = - ( elty / this.container.offsetHeight ) * 2 + 1;
    
    var vector = new THREE.Vector3( vpx, vpy, 0.5 );

    this.projector.unprojectVector( vector, this.camera );
	
    var pos = new THREE.Vector3;
    pos = this.camera.matrixWorld.multiplyVector3(pos);
    var ray = new THREE.Ray( pos, vector.subSelf( pos ).normalize() );

    var intersects = ray.intersectObject( this.scene, true );
	
    if ( intersects.length > 0 ) {
    	var i = 0;
    	while(!intersects[i].object.visible)
    	{
    		i++;
    	}
    	
    	var intersected = intersects[i];
    	if (intersected)
    	{
    		return { node : intersected.object, 
    				 point : intersected.point, 
    				 normal : intersected.face.normal
    				}
    	}
    	else
    		return null;
    }
    else
    {
    	return null;
    }
}

SB.GraphicsThreeJS.prototype.onDocumentMouseMove = function(event)
{
    event.preventDefault();
    
	var offset = $(this.renderer.domElement).offset();
	
	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;
	
    SB.Mouse.instance.onMouseMove(eltx, elty);
    
    if (SB.Picker)
    {
    	SB.Picker.handleMouseMove(eltx, elty);
    }
    
    SB.Game.handleMouseMove(event.pageX, event.pageY, eltx, elty);
}

SB.GraphicsThreeJS.prototype.onDocumentMouseDown = function(event)
{
    event.preventDefault();
    
	var offset = $(this.renderer.domElement).offset();
	
	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;
	
    SB.Mouse.instance.onMouseDown(eltx, elty);
    
    if (SB.Picker)
    {
    	SB.Picker.handleMouseDown(eltx, elty);
    }
    
    SB.Game.handleMouseDown(event.pageX, event.pageY, eltx, elty);
}

SB.GraphicsThreeJS.prototype.onDocumentMouseUp = function(event)
{
    event.preventDefault();

    var offset = $(this.renderer.domElement).offset();
	
	var eltx = event.pageX - offset.left;
	var elty = event.pageY - offset.top;
	
    
    SB.Mouse.instance.onMouseUp(eltx, elty);
    
    if (SB.Picker)
    {
    	SB.Picker.handleMouseUp(eltx, elty);
    }	            

    SB.Game.handleMouseUp(event.pageX, event.pageY, eltx, elty);
}

SB.GraphicsThreeJS.prototype.onDocumentMouseScroll = function(event, delta)
{
    event.preventDefault();
    
    SB.Mouse.instance.onMouseScroll(delta);

    if (SB.Picker)
    {
    	SB.Picker.handleMouseScroll(delta);
    }
    
    SB.Game.handleMouseScroll(delta);
}

SB.GraphicsThreeJS.prototype.onKeyDown = function(event)
{
	// N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
	event.preventDefault();

    SB.Keyboard.instance.onKeyDown(event.keyCode, event.charCode);
    
	SB.Game.handleKeyDown(event.keyCode, event.charCode);
}

SB.GraphicsThreeJS.prototype.onKeyUp = function(event)
{
	// N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
	event.preventDefault();

    SB.Keyboard.instance.onKeyUp(event.keyCode, event.charCode);
    
	SB.Game.handleKeyUp(event.keyCode, event.charCode);
}
	        
SB.GraphicsThreeJS.prototype.onKeyPress = function(event)
{
	// N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
	event.preventDefault();

    SB.Keyboard.instance.onKeyPress(event.keyCode, event.charCode);
    
	SB.Game.handleKeyPress(event.keyCode, event.charCode);
}

SB.GraphicsThreeJS.prototype.onWindowResize = function(event)
{
	this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);

	this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
	this.camera.updateProjectionMatrix();
}

SB.GraphicsThreeJS.prototype.setCursor = function(cursor)
{
	if (!cursor)
		cursor = this.saved_cursor;
	
	this.container.style.cursor = cursor;
}


SB.GraphicsThreeJS.prototype.update = function()
{
    this.renderer.setClearColor( 0, 0 );
	this.renderer.autoClearColor = true;
    this.renderer.render( this.backgroundLayer.scene, this.backgroundLayer.camera );
    this.renderer.setClearColor( 0, 1 );
	this.renderer.autoClearColor = false;
    this.renderer.render( this.scene, this.camera );

    var frameTime = Date.now();
    var deltat = (frameTime - this.lastFrameTime) / 1000;
    this.frameRate = 1 / deltat;

    this.lastFrameTime = frameTime;
    	
    if (this.stats)
    {
    	this.stats.update();
    }
    
    if (TWEEN !== undefined)
    {
    	TWEEN.update();
    }
}

SB.GraphicsThreeJS.prototype.enableShadows = function(enable)
{
	this.renderer.shadowMapEnabled = enable;
	this.renderer.shadowMapSoft = enable;
	this.renderer.shadowMapCullFrontFaces = false;
}

SB.GraphicsThreeJS.default_display_stats = false,
