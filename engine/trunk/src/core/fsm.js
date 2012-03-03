/**
 * @fileoverview FSM - Finite State Machine class
 * 
 * @author Tony Parisi
 * @author Don Olmstead
 */

goog.provide('SB.FSM');

SB.FSM = function(param)
{
    this._currentState = null;
    if (param)
    {
        this._currentState = param.state;
    }
}
	        
SB.FSM.prototype.update = function(object)
{
    if (this._currentState)
    {
        this._currentState.execute(object);
    }
}

SB.FSM.prototype.changeState = function(state, object)
{
    if (this._currentState == state)
    {
        return;
    }

    if (this._currentState)
    {
        this._currentState.exit(object);
    }

    if (state)
    {
        state.enter(object);
        this._currentState = state;
    }
}
