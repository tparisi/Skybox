
// Custom KeyFrameBall class
SB.Examples.KeyFrameBall = function()
{
	SB.Entity.call(this);

	this.transform = new SB.Transform();
	this.picker = new SB.Picker();
	
    var avParams = {};
    avParams.radiusTop    = 1;
    avParams.radiusBottom = 1;
    avParams.height       = 1.667;
    avParams.color = 0x0000ff;

	this.visual = new SB.CylinderVisual(avParams);

	this.addComponent(this.transform);
	this.addComponent(this.visual);	
	this.addComponent(this.picker);	

    this.animator = new SB.KeyFrameAnimator({ 
    	interps:
    		[ 
    	    { keys:SB.Examples.KeyFrameBall.positionKeys, values:SB.Examples.KeyFrameBall.positionValues, target:this.transform.position },
    	    { keys:SB.Examples.KeyFrameBall.rotationKeys, values:SB.Examples.KeyFrameBall.rotationValues, target:this.transform.rotation } 
    		],
    	loop: SB.Examples.KeyFrameBall.loopAnimation,
    	duration:SB.Examples.KeyFrameBall.animation_time
    });
    
    this.addComponent(this.animator);	
    
	this.picker.subscribe("mouseUp", this, this.onMouseUp);
	this.picker.subscribe("mouseOver", this, this.onMouseOver);
	this.picker.subscribe("mouseOut", this, this.onMouseOut);
    this.animator.subscribe("complete", this, this.onAnimationComplete)

    this.animating = false;

    this.overCursor = 'pointer';
}

goog.inherits(SB.Examples.KeyFrameBall, SB.Entity);

SB.Examples.KeyFrameBall.prototype.animate = function(on)
{
	if (on)
	{
		this.animator.loop = SB.Examples.KeyFrameBall.loopAnimation;
	    this.animator.start();
	}
	else
	{
		this.animator.stop();
	}
}

SB.Examples.KeyFrameBall.prototype.onAnimationComplete = function()
{
	this.animating = false;
}

SB.Examples.KeyFrameBall.prototype.onMouseOver = function()
{
	SB.Graphics.instance.container.style.cursor = 'pointer';
}

SB.Examples.KeyFrameBall.prototype.onMouseOut = function()
{
	SB.Graphics.instance.container.style.cursor = 'auto';
}

SB.Examples.KeyFrameBall.prototype.onMouseUp = function(x, y)
{
	this.animating = !this.animating;
	this.animate(this.animating);
}

SB.Examples.KeyFrameBall.positionKeys = [0, .25, .75, 1];
SB.Examples.KeyFrameBall.positionValues = [ { x : -2, y: 0, z : 2}, 
                        { x: 0, y: 1, z: 0},
                        { x: 2, y: 0, z: -2},
                        { x : -2, y: 0, z : 2}
                        ];
SB.Examples.KeyFrameBall.rotationKeys = [0, .5, 1];
SB.Examples.KeyFrameBall.rotationValues = [ { z: 0 }, 
                                { z: Math.PI},
                                { z: Math.PI * 2 },
                                ];

SB.Examples.KeyFrameBall.loopAnimation = false;
SB.Examples.KeyFrameBall.animation_time = 3000;

