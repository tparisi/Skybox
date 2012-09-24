goog.provide('SB.Examples.MeshTest');
goog.require('SB.Game');
goog.require('SB.Mesh');

SB.Examples.MeshTest = function()
{
    SB.Game.call(this);
	
}

goog.inherits(SB.Examples.MeshTest, SB.Game);

SB.Examples.MeshTest.prototype.initialize = function(param)
{	
	SB.Game.prototype.initialize.call(this, param);
    
    SB.Graphics.instance.camera.position.set( 0, 0, 30 );
//    SB.Graphics.instance.camera.lookAt(new THREE.Vector3(0, 0, 0));

	this.initEntities();
} ;

SB.Examples.MeshTest.prototype.initEntities = function()
{
    var e = new SB.Entity();

    // Create the transform
    // \todo entity.transform is a hack
    var transform = new SB.Transform();
    e.addComponent(transform);

    var mesh = new SB.Mesh();
    e.addComponent(mesh);
    
	var timer = new SB.Timer( { duration : 5000 } );
    e.addComponent(timer);
    
    this.addEntity(e);
    
    e.realize();

    this.mesh = mesh;
    this.meshBuilt = false;

    this.timer = timer;
    
	this.timer.subscribe("fraction", this, this.onTimeFractionChanged);
	this.timer.start();
}

SB.Examples.MeshTest.prototype.buildMesh = function(outerRadius)
{
	var outerRadius = 10,
	innerRadius = 5,
	gridY = 10;
	
	var i, twopi = 2 * Math.PI;
	var iVer = Math.max( 2, gridY );
	
	var origin = new THREE.Vector3(0, 0, 0);	
	//this.vertices.push(new THREE.Vertex(origin));
	
	for ( i = 0; i < ( iVer + 1 ) ; i++ ) {
	
		var fRad1 = i / iVer;
		var fRad2 = (i + 1) / iVer;
		var fX1 = innerRadius * Math.cos( fRad1 * twopi );
		var fY1 = innerRadius * Math.sin( fRad1 * twopi );
		var fX2 = outerRadius * Math.cos( fRad1 * twopi );
		var fY2 = outerRadius * Math.sin( fRad1 * twopi );
		var fX4 = innerRadius * Math.cos( fRad2 * twopi );
		var fY4 = innerRadius * Math.sin( fRad2 * twopi );
		var fX3 = outerRadius * Math.cos( fRad2 * twopi );
		var fY3 = outerRadius * Math.sin( fRad2 * twopi );
		
		var v1 = new THREE.Vector3( fX1, fY1, 0 );
		var v2 = new THREE.Vector3( fX2, fY2, 0 );
		var v3 = new THREE.Vector3( fX3, fY3, 0 );
		var v4 = new THREE.Vector3( fX4, fY4, 0 );
		this.mesh.geometry.vertices.push( new THREE.Vertex( v1 ) );
		this.mesh.geometry.vertices.push( new THREE.Vertex( v2 ) );
		this.mesh.geometry.vertices.push( new THREE.Vertex( v3 ) );
		this.mesh.geometry.vertices.push( new THREE.Vertex( v4 ) );
		
	}
	
	for ( i = 0; i < iVer ; i++ ) {
	
		this.mesh.geometry.faces.push(new THREE.Face3( i * 4, i * 4 + 1, i * 4 + 2));
		this.mesh.geometry.faces.push(new THREE.Face3( i * 4, i * 4 + 2, i * 4 + 3));
		this.mesh.geometry.faceVertexUvs[ 0 ].push( [
			       						new THREE.UV(0, 1),
			       						new THREE.UV(1, 1),
			       						new THREE.UV(1, 0) ] );
		this.mesh.geometry.faceVertexUvs[ 0 ].push( [
			       						new THREE.UV(0, 1),
			       						new THREE.UV(1, 0),
			       						new THREE.UV(0, 0) ] );
	}	
	
	// this.mesh.rebuild();
	
//	this.mesh.geometry.computeCentroids();
//	this.mesh.geometry.computeFaceNormals();
	
//	this.mesh.geometry.boundingSphere = { radius: outerRadius };
}


SB.Examples.MeshTest.prototype.onTimeFractionChanged = function(fract)
{
	if (!this.meshBuilt)   
	{
		this.buildMesh();
		this.meshBuilt = true;
	}
	
	var delta = fract - .5;
	var cos = Math.cos(fract * Math.PI);
	
	var i, len = this.mesh.geometry.vertices.length;
	for (i = 0; i < len; i++)
	{
		var vertex = this.mesh.geometry.vertices[i];
		vertex.position.x += delta;
		vertex.position.y += cos / 2;
	}
//    this.mesh.geometry.__dirtyVertices = true;
	
	//this.mesh.rotation.y = (fract * Math.PI * 2);	
}