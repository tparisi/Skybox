
var DBManager = require('./db/DBManager.js');
var utils = require('./utils.js');

function BaseDao() {
	this.dbMgr = new DBManager();
	this.db = this.dbMgr.getDb();
}

var p = BaseDao.prototype;


/**
 * Get the names of all mutable properties that should be persisted
 * to the DB during update calls.
 */
p.getMutablePropertyNames = function() {
	throw new Error('Not implemented');
};

p.create = function(obj, cb) {
	var doc = obj;
	if (obj.toDoc) {
		doc = obj.toDoc();
	}
	this.db.save(doc, function(err, results) {
		if (err) {
			throw new Error('Error inserting kanban: ' + err);
		}
		cb(null, results);
	});
};

p.getObjectById = function(id, cb) {
	console.log('retrieving object with id = ' + id);
	this.db.get(id, function(err, doc) {
		if (err) {
			cb('Error reading object: ' + err);
		}
		else {
			cb(null, doc);
		}
	});
};

/**
 * Update an existing object.
 */
p.update = function(obj, cb) {
	var self = this;
	this.getObjectById(obj.getId(), function(err, current) {
		if (err) {
			cb('Error retrieving object for update: ' + err);
		}
		else {
			var current = utils.merge(current, obj, self.getMutablePropertyNames());
			var doc = current;
			if (current.toDoc) {
				doc = current.toDoc();
			}
			self.db.save(current._id, current._rev, doc, function(err, res) {
				if (err) {
					cb('Error updating ' + (obj.type || 'object') + ': ' + err);
				}
				cb(null, current);
			});
		}
	});
};

/**
 * Delete an object.
 */
p.remove = function(id, cb) {
	var rev;
	var self = this;
	var crnt = this.getById(id, function(err, doc) {
		if (err) {
			cb('Error querying for object.');
		}
		else if (!doc || !doc._rev) {
			cb('Object not found, or no revision number.');
		}
		else {
			console.log('deleting version # ' + doc._rev + ' of doc id ' + id);
			self.dbMgr.remove(id, doc._rev, function(err, res) {
				if (err) {
					cb('Error deleting object: ' + err);
				}
				else {
					cb(null, res);
				}
			});
		}
	});
};

module.exports = BaseDao;
