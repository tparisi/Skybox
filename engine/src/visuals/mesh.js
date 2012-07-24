/**
 * @fileoverview A visual containing an arbitrary mesh.
 * @author Tony Parisi
 */
goog.provide('SB.Mesh');
goog.require('SB.Visual');

/**
 * @param {Object} param supports the following options:
 * @constructor
 * @extends {SB.Visual}
 */
SB.Mesh = function(param) {
    SB.Visual.call(this, param);

    this.param = param || {};
}

goog.inherits(SB.Mesh, SB.Visual);

SB.Mesh.prototype.realize = function()
{
	SB.Visual.prototype.realize.call(this);
	
	this.geometry = new THREE.Geometry();
	this.geometry.dynamic = true;
	this.material = new THREE.MeshBasicMaterial({wireframe:true, color: 0xffffff});
	
	this.object = new THREE.Mesh(this.geometry, this.material);
	
    this.addToScene();
}

SB.Mesh.prototype.rebuild = function()
{
	this.geometry.computeCentroids();
	this.geometry.computeFaceNormals();
	this.geometry.computeBoundingBox();
	this.geometry.computeBoundingSphere();
	this.removeFromScene();
	
	this.object = new THREE.Mesh(this.geometry, this.material);
	this.addToScene();
}