/**
 * @fileoverview A rectangle visual
 * @author Tony Parisi
 */

goog.provide('SB.Pane');
goog.require('SB.Visual');

SB.Pane = function(param) {

    SB.Visual.call(this, param);

    this.param = param || {};
}

goog.inherits(SB.Pane, SB.Visual)

SB.Pane.prototype.realize = function()
{
	SB.Visual.prototype.realize.call(this);
	
    var width = this.param.width || 1;
    var height = this.param.height || 1;
    var segmentsWidth = 8;
    var segmentsHeight = 8; // N.B.: do these ever need to be a soft setting?
    
    var material = this.param.material || new THREE.MeshBasicMaterial( { color: 0x80aaaa, opacity: 1, transparent: false, wireframe: false } );
	
	var geometry = new THREE.PlaneGeometry( width, height, segmentsWidth, segmentsHeight );
	
    this.object = new THREE.Mesh(geometry, material);
    this.object.doubleSided = true;

    this.addToScene();
}

