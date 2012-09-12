/**
 * @fileoverview A PointSet visual
 * @author Tony Parisi
 */

goog.provide('SB.PointSet');
goog.require('SB.Visual');

SB.PointSet = function(param) {

    SB.Visual.call(this, param);

    this.param = param || {};
    this.param.color = this.param.color || 0;
    this.param.opacity = this.param.opacity || 1;
    this.param.size = this.param.size || 1;
}

goog.inherits(SB.PointSet, SB.Visual)

SB.PointSet.prototype.realize = function()
{
	SB.Visual.prototype.realize.call(this);
	
	// Create a group to hold our particles
	var group = new THREE.Object3D();

	var i;
	var geometry = new THREE.Geometry();

	var nVerts = this.param.points.length;
	
	for ( i = 0; i < nVerts; i++)
	{		
		geometry.vertices.push( new THREE.Vertex( this.param.points[i] ) );
	}

	var material = new THREE.ParticleBasicMaterial( { color: this.param.color, 
		opacity : this.param.opacity,
		size: this.param.size, 
		sizeAttenuation: false } );
	
	var particles = new THREE.ParticleSystem( geometry, material );

	group.add( particles );

	this.object = group;
	    
    this.addToScene();
}

