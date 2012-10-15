/**
 * @fileoverview A wire grid floor plane
 * @author Tony Parisi
 */

goog.provide('SB.Grid');
goog.require('SB.Visual');

SB.Grid = function(param)
{
	SB.Visual.call(this, param);
	param = param || {};
	this.size = param.size || 10;
	this.stepSize = param.stepSize || 1;
	this.color = (param.color === undefined) ? 0xcccccc : param.color;
}

goog.inherits(SB.Grid, SB.Visual);

SB.Grid.prototype.realize = function()
{
	SB.Visual.prototype.realize.call(this);
	
	var line_material = new THREE.LineBasicMaterial( { color: this.color, opacity: 0.2 } ),
		geometry = new THREE.Geometry(),
		floor = -0.04, step = this.stepSize, size = this.size;

	for ( var i = 0; i <= size / step * 2; i ++ )
	{
		geometry.vertices.push( new THREE.Vector3( - size, floor, i * step - size ) );
		geometry.vertices.push( new THREE.Vector3(   size, floor, i * step - size ) );

		geometry.vertices.push( new THREE.Vector3( i * step - size, floor, -size ) );
		geometry.vertices.push( new THREE.Vector3( i * step - size, floor,  size ) );
	}

	this.object = new THREE.Line( geometry, line_material, THREE.LinePieces );
    
    this.addToScene();
}

