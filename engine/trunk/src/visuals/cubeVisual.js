/**
 * @fileoverview A visual containing a cylinder mesh.
 * @author Don Olmstead
 */
goog.provide('SB.CubeVisual');
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
SB.CubeVisual = function(param) {
    SB.Visual.call(this, param);

    this.param = param || {};
}

goog.inherits(SB.CubeVisual, SB.Visual);

SB.CubeVisual.prototype.realize = function()
{
	SB.Visual.prototype.realize.call(this);
	
    var width = this.param.width || 2.0;
    var height = this.param.height || 2.0;
    var depth = this.param.depth || 2.0;
    var color;
    if (this.param.color === null)
    {
    	color = 0x808080;
    }
    else
    {
    	color = this.param.color;
    }
    
    var ambient = this.param.ambient || 0;
    
	var geometry = new THREE.CubeGeometry(width, height, depth);
	this.object = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial( { color: color, opacity: 1, ambient: ambient, transparent: false, wireframe: false } ));
	
    this.addToScene();
}

