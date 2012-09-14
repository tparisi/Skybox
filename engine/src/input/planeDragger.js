/**
 * @fileoverview PlaneDragger - converts x,y mouse motion into x, y object position output
 * 
 * @author Tony Parisi
 */

goog.provide('SB.PlaneDragger');
goog.require('SB.Component');

SB.PlaneDragger = function(param)
{
	SB.Component.call(this, param);	
}

goog.inherits(SB.PlaneDragger, SB.Component);

SB.PlaneDragger.prototype.realize = function(object)
{
	// Connect us to the object to drag
    this.object = this._entity.transform.object;
    
    // Squirrel away some info
    var instance = SB.Graphics.instance;
	this.projector = instance.projector;
	this.container = instance.container;
	this.renderer = instance.renderer;
	
    // And some helpers
	this.dragOffset = new THREE.Vector3;
	this.dragHitPoint = new THREE.Vector3;
	this.dragStartPoint = new THREE.Vector3;
	this.dragPlane = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0x000000 } ) );
}

SB.PlaneDragger.prototype.beginDrag = function(x, y)
{
	var planeIntersects = this.getPlaneIntersection(x, y);
	
	if (planeIntersects.length)
	{
		this.dragOffset.copy( planeIntersects[ 0 ].point.subSelf( this.dragPlane.position ));
		this.dragStartPoint = this.object.position.clone();
	}
}

SB.PlaneDragger.prototype.drag = function(x, y)
{
	var planeIntersects = this.getPlaneIntersection(x, y);
	
	if (planeIntersects.length)
	{
		this.dragHitPoint.copy(planeIntersects[ 0 ].point.subSelf( this.dragOffset ) );
		this.dragHitPoint.addSelf(this.dragStartPoint);
		this.publish("drag", this.dragHitPoint);
	}			
}

SB.PlaneDragger.prototype.endDrag = function(x, y)
{
	// Nothing to do, just here for completeness
}

SB.PlaneDragger.prototype.getPlaneIntersection = function(x, y)
{
	var camera = SB.Graphics.instance.camera;
	
	// Translate page coords to element coords
	var offset = $(this.renderer.domElement).offset();	
	var eltx = x - offset.left;
	var elty = y - offset.top;
	
	// Translate client coords into viewport x,y
	var vpx = ( eltx / this.container.offsetWidth ) * 2 - 1;
	var vpy = - ( elty / this.container.offsetHeight ) * 2 + 1;
	
	var vector = new THREE.Vector3( vpx, vpy, 0.5 );
	
	this.projector.unprojectVector( vector, camera );
	
    var cameraPos = new THREE.Vector3;
    cameraPos = camera.matrixWorld.multiplyVector3(cameraPos);
    
	var ray = new THREE.Ray( cameraPos, vector.subSelf( cameraPos ).normalize() );
	
	return ray.intersectObject( this.dragPlane );
}

