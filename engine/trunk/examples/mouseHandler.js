goog.provide('SB.Examples.MouseHandler');
goog.require('SB.Component');

SB.Examples.MouseHandler = function(param)
{
    this.init(param);
} ;

goog.inherits(SB.Examples.MouseHandler, SB.Component);

SB.Examples.MouseHandler.prototype.init = function(param)
{
} ;

SB.Examples.MouseHandler.prototype.update = function()
{
} ;

SB.Examples.MouseHandler.prototype.onMouseDown = function(x, y)
{
    alert ("I got clicked");
} ;
