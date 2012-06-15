/**
 *
 */
goog.provide('SB.Input');
goog.require('SB.Service');
goog.require('SB.Mouse');
goog.require('SB.Keyboard');

SB.Input = function()
{
	// N.B.: freak out if somebody tries to make 2
	// throw (...)

	this.mouse = new SB.Mouse();
	this.keyboard = new SB.Keyboard();
	SB.Input.instance = this;
}

goog.inherits(SB.Input, SB.Service);

SB.Input.instance = null;