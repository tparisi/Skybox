
goog.provide('SB.ShooterComponent');
goog.require('SB.Component');
goog.require('SB.Mouse');

SB.ShooterState = {
    Placing: 0,
    Aiming: 1,
    Shooting: 2
}
/**
 * @constructor
 */
SB.ShooterComponent = function()
{
    this.state = SB.ShooterState.Placing;
    this.radius = 75.0;
    this.impulseMagnitude = 4000.0;
    this.halfWidth = 720;
    this.halfHeight = 400;

    this.lastState =
    {
        x : SB.Mouse.NO_POSITION, y: SB.Mouse.NO_POSITION,
        buttons : { left : false, middle : false, right : false },
        scroll : 0
    };
}

goog.inherits(SB.ShooterComponent, SB.Component);

SB.ShooterComponent.prototype.update = function()
{
    var state = SB.Mouse.instance.getState();

    var x = state.x - this.halfWidth;
    var y = state.y - this.halfHeight;

    var invLength = 1.0 / Math.sqrt(x * x + y * y);
    var cursorX = this.radius *  y * invLength;
    var cursorY = this.radius * -x * invLength;
    var position = new b2Vec2(cursorX, cursorY);

    if (this.state == SB.ShooterState.Placing)
    {
        if ((state.buttons.left == true) && (this.lastState.buttons.left == false))
        {
            this.state = SB.ShooterState.Aiming;
        }

        // HACK HACK HACK
        this._entity.rigidBody.body.SetPosition(position);
    }
    else if (this.state == SB.ShooterState.Aiming)
    {
        if ((state.buttons.left == true) && (this.lastState.buttons.left == false))
        {
            var puckPosition = this._entity.rigidBody.body.GetPosition();
            var dx = position.x - puckPosition.x;
            var dy = position.y - puckPosition.y;

            var invAimLength = 1.0 / Math.sqrt(dx * dx + dy * dy);
            var impulseX = this.impulseMagnitude * dx * invAimLength;
            var impulseY = this.impulseMagnitude * dy * invAimLength;

            this._entity.rigidBody.applyForce(impulseX, 0, impulseY);
            this.state = SB.ShooterState.Shooting;
        }
    }

    this.lastState =
    {
        x : state.x, y: state.y,
        buttons : { left : state.buttons.left, middle : state.buttons.middle, right : state.buttons.right },
        scroll : state.scroll
    };
}