/**
 * @fileoverview Entity collects a group of Components that define a game object and its behaviors
 * 
 * @author Tony Parisi
 */
goog.provide('SB.Entity');
goog.require('SB.PubSub');

/**
 * Creates a new Entity.
 * @constructor
 * @extends {SB.PubSub}
 */
SB.Entity = function() {
    SB.PubSub.call(this);
    
    /**
     * @type {number}
     * @private
     */
    this._id = SB.Entity.nextId++;

    /**
     * @type {SB.Entity}
     * @private
     */
    this._parent = null;

    /**
     * @type {Array.<SB.Entity>}
     * @private
     */
    this._children = [];

    /**
     * @type {Array}
     * @private
     */
    this._components = [];
}

goog.inherits(SB.Entity, SB.PubSub);

/**
 * The next identifier to hand out.
 * @type {number}
 * @private
 */
SB.Entity.nextId = 0;

SB.Entity.prototype.getID = function() {
    return this._id;
}

//---------------------------------------------------------------------
// Hierarchy methods
//---------------------------------------------------------------------

/**
 * Sets the parent of the Entity.
 * @param {SB.Entity} parent The parent of the Entity.
 * @private
 */
SB.Entity.prototype.setParent = function(parent) {
    this._parent = parent;
}

/**
 * Adds a child to the Entity.
 * @param {SB.Entity} child The child to add.
 */
SB.Entity.prototype.addChild = function(child) {
    if (!child)
    {
        throw new Error('Cannot add a null child');
    }

    if (child._parent)
    {
        throw new Error('Child is already attached to an Entity');
    }

    child.setParent(this);
    this._children.push(child);
}

/**
 * Removes a child from the Entity
 * @param {SB.Entity} child The child to remove.
 */
SB.Entity.prototype.removeChild = function(child) {
    var i = this._children.indexOf(child);

    if (i != -1)
    {
        this._children.splice(i, 1);
        child.setParent(null);
    }
}

//---------------------------------------------------------------------
// Component methods
//---------------------------------------------------------------------

/**
 * Adds a Component to the Entity.
 * @param {SB.Component} component.
 */
SB.Entity.prototype.addComponent = function(component) {
    if (!component)
    {
        throw new Error('Cannot add a null component');
    }
    if (component.entity)
    {
        throw new Error('Component is already attached to an Entity')
    }

    this._components.push(component);
    component.setEntity(this);
}

/**
 * Removes a Component from the Entity.
 * @param {SB.Component} component.
 */
SB.Entity.prototype.removeComponent = function(component) {
    var i = this._components.indexOf(component);

    if (i != -1)
    {
        this._components.splice(i, 1);
        component.setEntity(null);
    }
}

//---------------------------------------------------------------------
//Initialize methods
//---------------------------------------------------------------------

SB.Entity.prototype.realize = function() {
    this.realizeComponents();
    this.realizeChildren();
}

/**
 * @private
 */
SB.Entity.prototype.realizeComponents = function() {
    var component;
    var count = this._components.length;
    var i = 0;

    for (; i < count; ++i)
    {
        this._components[i].realize();
    }
}

/**
 * @private
 */
SB.Entity.prototype.realizeChildren = function() {
    var child;
    var count = this._children.length;
    var i = 0;

    for (; i < count; ++i)
    {
        this._children[i].realize();
    }
}

//---------------------------------------------------------------------
// Update methods
//---------------------------------------------------------------------

SB.Entity.prototype.update = function() {
    this.handleMessages();
    this.updateComponents();
    this.updateChildren();
}

/**
 * @private
 */
SB.Entity.prototype.updateComponents = function() {
    var component;
    var count = this._components.length;
    var i = 0;

    for (; i < count; ++i)
    {
        this._components[i].update();
    }
}

/**
 * @private
 */
SB.Entity.prototype.updateChildren = function() {
    var child;
    var count = this._children.length;
    var i = 0;

    for (; i < count; ++i)
    {
        this._children[i].update();
    }
}
