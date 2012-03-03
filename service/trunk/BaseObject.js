// BaseObject class definition

function BaseObject(type, data) {
	this.type = type;
	if (data) {
		this._id = data._id;
		this._rev = data._rev;
		this.name = data.name;
		this.description = data.description;
	}
};

var p = BaseObject.prototype;


p.setId = function(id) {
	this._id = id;
};


p.getId = function() {
	return this._id;
};


p.setRev = function(rev) {
	this._rev = rev;
};


p.getRev = function() {
	return this._rev;
};

p.setName = function(n) {
	this.name = n;
};

p.getName = function() {
	return this.name;
};

p.setDescription = function(desc) {
	this.description = desc;
};

p.getDescription = function() {
	return this.description;
};

p.getType = function() {
	return this.type;
}

/**
 * Subclasses should implement this to return a new doc without nested sub-entities.
 */
p.toDoc = function() {
	var doc = { 
		"type" : this.getType(),
		"name" : this.name,
		"description" : this.description
		};
	if (this.__test_object) {
		doc.test_object = true;
	}
	return doc;
};

p.equals = function(other) {
	return this.getId() == other.getId();
};


module.exports = BaseObject;