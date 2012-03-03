/**
 * @fileoverview Component is the base class for defining objects used within an Entity
 * 
 * @author Tony Parisi
 * @author Don Olmstead
 */
goog.provide('SB.Component');
goog.require('SB.PubSub');

/**
 * Creates a new Component.
 * @constructor
 */
SB.Component = function() {
    SB.PubSub.call(this);
    
    /**
     * @type {SB.Entity}
     * @private
     */
    this._entity = null;
}

goog.inherits(SB.Component, SB.PubSub);

/**
 * Gets the Entity the Component is associated with.
 * @returns {SB.Entity} The Entity the Component is associated with.
 */
SB.Component.prototype.getEntity = function() {
    return this._entity;
}

/**
 * Sets the Entity the Component is associated with.
 * @param {SB.Entity} entity
 */
SB.Component.prototype.setEntity = function(entity) {
    this._entity = entity;
}

SB.Component.prototype.realize = function() {
    
}

SB.Component.prototype.update = function() {
    
}
