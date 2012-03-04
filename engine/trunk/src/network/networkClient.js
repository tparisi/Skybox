/**
 * @fileoverview NetworkClient - Broadcast/listen on network
 * 
 * @author Tony Parisi
 */
goog.provide('SB.NetworkClient');
goog.require('SB.Component');

SB.NetworkClient = function(param)
{
	this.param = param || {};
	
    SB.Component.call(this);
    this.running = false;
}

goog.inherits(SB.NetworkClient, SB.Component);

SB.NetworkClient.prototype.realize = function()
{
	SB.Component.prototype.realize.call(this);
}

SB.NetworkClient.prototype.start = function()
{
    this.running = true;
}

SB.NetworkClient.prototype.stop = function(x, y)
{
    this.running = false;
}

SB.NetworkClient.prototype.update = function()
{	
    if (!this.running)
    {
        return;
    }
}
