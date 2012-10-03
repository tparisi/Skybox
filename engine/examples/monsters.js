SB.Examples.Monsters = function()
{
	SB.Game.call(this);	    	
	
	this.helpScreen = null;
}

goog.inherits(SB.Examples.Monsters, SB.Game);

SB.Examples.Monsters.prototype.initialize = function(param)
{
	if (!param)
		param = {};
	
	if (!param.backgroundColor)
		param.backgroundColor = SB.Examples.Monsters.default_bgcolor;

	if (!param.displayStats)
		param.displayStats = SB.Examples.Monsters.default_display_stats;
	
	SB.Game.prototype.initialize.call(this, param);
	
	this.initEntities();
}


SB.Examples.Monsters.prototype.initEntities = function()
{
	this.root = new SB.Entity;
	this.dragger = new SB.Dragger();
	this.rotator = new SB.Rotator();
	this.root.addComponent(this.dragger);
	this.root.addComponent(this.rotator);
	this.dragger.subscribe("move", this, this.onDraggerMove);
	this.rotator.subscribe("rotate", this, this.onRotatorRotate);
	
	var grid = new SB.Grid({size: 14});
	this.root.addComponent(grid);
	
	var m1 = new SB.Examples.Monster();
	m1.transform.position.x = 5;

	var m2 = new SB.Examples.Monster();
	m2.transform.position.x = -5;

	var m3 = new SB.Examples.Monster();
	m3.transform.position.z = -5;

	this.monsters = [m1, m2, m3];
	this.activeMonster = null;
	
	var viewer = SB.Prefabs.WalkthroughController({ headlight : true });
	
	var viewpoint = viewer.getChild(0);
	viewpoint.transform.position.set(0, 2.5, 3.67);

	this.controllerScript = viewer.getComponent(SB.WalkthroughControllerScript);

	this.root.addChild(m1);
	this.root.addChild(m2);
	this.root.addChild(m3);
	this.root.addChild(viewer);
	
	this.addEntity(this.root);
	
	this.root.realize();
}

SB.Examples.Monsters.prototype.onKeyDown = function(keyCode, charCode)
{
	if (this.activeMonster)
		this.activeMonster.onKeyDown(keyCode, charCode);
	else
		SB.Game.prototype.onKeyDown.call(this, keyCode, charCode)

}

SB.Examples.Monsters.prototype.onKeyUp = function(keyCode, charCode)
{
	this.lastdy = 0;
	var mi;
	
	var handled = false;
	switch (String.fromCharCode(keyCode))
	{
    	case 'H' :
    		this.help();
    		handled = true;
    		break;
    		
    	case '1' :
    		mi = 1;
    		break;
    	case '2' :
    		mi = 2;
    		break;
    	case '3' :
    		mi = 3;
    		break;
    		
    	default : 
    		break;
	}

	if (!handled && this.activeMonster)
	{
		this.activeMonster.onKeyUp(keyCode, charCode);
	}
		
	if (mi)
	{
		var monster = this.monsters[mi-1];
		this.setActiveMonster(monster);
	}
	
	if (!handled)
		SB.Game.prototype.onKeyUp.call(this, keyCode, charCode)
}

SB.Examples.Monsters.prototype.onKeyPress = function(keyCode, charCode)
{
	SB.Game.prototype.onKeyPress.call(this, keyCode, charCode)
}

SB.Examples.Monsters.prototype.onRotatorRotate = function(axis, delta)
{
	delta *= .666;
	
	if (delta != 0)
	{
		// this.controllerScript.transform.rotation.y -= delta;
		var dir = new THREE.Vector3(0, -delta, 0);
		this.controllerScript.turn(dir);
		this.lastrotate = delta;
	}
}

SB.Examples.Monsters.prototype.onDraggerMove = function(dx, dy)
{
	if (Math.abs(dy) <= 2)
		dy = 0;
	
	dy *= .02;
	
	if (dy)
	{
		this.lastdy = dy;
	}
	else if (this.lastdy && this.dragging)
	{
		dy = this.lastdy;
	}

	if (dy != 0)
	{
		// this.controllerScript.transform.position.z -= dy;
		var dir = new THREE.Vector3(0, 0, -dy);
		this.controllerScript.move(dir);
	}
}

SB.Examples.Monsters.prototype.setActiveMonster = function(monster)
{
	if (this.activeMonster)
	{
		this.activeMonster.setActive(false);
	}
	
	monster.setActive(true);
	
	this.activeMonster = monster;
}

SB.Examples.Monsters.prototype.help = function()
{
	if (!this.helpScreen)
	{
		this.helpScreen = new SB.Examples.MonstersHelp();
	}
	
	this.helpScreen.show();
}

SB.Examples.Monsters.default_bgcolor = '#000000';
SB.Examples.Monsters.default_display_stats = true;
