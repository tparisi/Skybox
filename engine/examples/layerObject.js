
// Custom LayerObject class
SB.Examples.LayerObject = function()
{
	SB.Entity.call(this);

	this.transform = new SB.Transform({layer:SB.Graphics.instance.backgroundLayer});
	this.addComponent(this.transform);

	var child = new SB.Entity;
	var transform = new SB.Transform();
	child.addComponent(transform);
	transform.position.x = 2;
	var map = THREE.ImageUtils.loadTexture('./images/duckCM.png');
	var cube = new SB.CubeVisual({map:map});
	child.addComponent(cube);
    this.addChild(child);
	
    var animator = new SB.KeyFrameAnimator({ 
    	interps:
    		[ 
    	    { keys:SB.Examples.LayerObject.positionKeys, values:SB.Examples.LayerObject.positionValues, target:child.transform.position },
    		],
    	loop: SB.Examples.LayerObject.loopAnimation,
    	duration:SB.Examples.LayerObject.animation_time
    });
    
    child.addComponent(animator);	
}

goog.inherits(SB.Examples.LayerObject, SB.Entity);

SB.Examples.LayerObject.prototype.update = function()
{
	this.transform.rotation.z += 0.01;
	this._children[0].transform.rotation.y += 0.01;
	
	SB.Entity.prototype.update.call(this);
}

SB.Examples.LayerObject.positionKeys = [0, .25, .75, 1];
SB.Examples.LayerObject.positionValues = [ { x : -2, y: 0, z : 2}, 
                        { x: 0, y: 1, z: 0},
                        { x: 2, y: 0, z: -2},
                        { x : -2, y: 0, z : 2}
                        ];


SB.Examples.LayerObject.loopAnimation = true;
SB.Examples.LayerObject.animation_time = 3000;

