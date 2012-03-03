/**
 * @fileoverview A wire grid floor plane
 * @author Tony Parisi
 */

goog.provide('SB.Grid');
goog.require('SB.Visual');

SB.Grid = function(param)
{
	SB.Visual.call(this, param);
}

goog.inherits(SB.Grid, SB.Visual);

SB.Grid.prototype.realize = function()
{
	SB.Visual.prototype.realize.call(this);
	
	var line_material = new THREE.LineBasicMaterial( { color: 0xcccccc, opacity: 0.2 } ),
		geometry = new THREE.Geometry(),
		floor = -0.04, step = 1, size = 14;

	for ( var i = 0; i <= size / step * 2; i ++ )
	{
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( - size, floor, i * step - size ) ) );
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3(   size, floor, i * step - size ) ) );

		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor, -size ) ) );
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - size, floor,  size ) ) );
	}

	this.object = new THREE.Line( geometry, line_material, THREE.LinePieces );
    
    this.addToScene();
}

