/**
 * @fileoverview A visual containing a cylinder mesh.
 * @author Tony Parisi
 */
goog.provide('SB.CylinderVisual');
goog.require('SB.Visual');

/**
 * @param {Object} param supports the following options:
 *   radiusTop (number): The top radius of the cylinder
 *   radiusBottom (number): The bottom radius of the cylinder
 *   height (number): The height of the cylinder
 *   segmentsRadius (number): The radius of the segments
 *   segmentsHeight (number): The height of the segments
 *   openEnded (boolean): Whether the cylinder is open ended
 * @constructor
 * @extends {SB.Visual}
 */
SB.CylinderVisual = function(param) {
    SB.Visual.call(this, param);

    this.param = param || {};
}

goog.inherits(SB.CylinderVisual, SB.Visual);

SB.CylinderVisual.prototype.realize = function()
{
	SB.Visual.prototype.realize.call(this);
	
    var radiusTop = this.param.radiusTop || 1.0;
    var radiusBottom = this.param.radiusBottom || 1.0;
    var height = this.param.height || 1.0;
    var segmentsRadius = this.param.segmentsRadius || 100;
    var segmentsHeight = this.param.segmentsHeight || 100;
    var openEnded = this.param.openEnded || false;
    var color = this.param.color || 0xFFFFFF;
    var ambient = this.param.ambient || 0;
    
	var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segmentsRadius, segmentsHeight, openEnded);
	this.object = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color : color }));
	
    this.addToScene();
}
