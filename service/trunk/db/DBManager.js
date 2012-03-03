/**
 * Database manager class.
 * Provides direct access to the cradle couchdb client.
 * Also provides some utility methods.
 */

var DB_HOST = 'localhost';
var DB_PORT = 5984;
var DB_NAME = 'forbidden';

var sys = require('util');

var cradle = require('cradle');
cradle.setup({
	host: DB_HOST,
	port : DB_PORT,
	cache: true, 
	raw: false
});


function DbManager() {
	this.connection = new(cradle.Connection)();
	this.db = this.connection.database(DB_NAME);
};

var p = DbManager.prototype;

/**
 * Returns a direct reference to the Cradle couchdb adapter.
 */
p.getDb =function() {
	return this.db;
};

/**
 * Returns the couchdb connection
 */
p.getConnection = function() {
	return this.connection;
};

/**
 * Generate UUIDs for storing docs to the DB.
 */
p.uuids = function(count, cb) {
	this.connection.uuids(count, cb);
};

/**
 * Delete a doc.
 * Use this instead of getDb().remove() as it merely marks objects as deleted instead of actually deleting them.
 */
p.remove = function(doc, cb) {
	this.getDb().get(id, function(err, doc) {
		if (err) {
			cb('Error retrieving object: ' + err);
		}
		else {
			doc[PROP_DATE_DELETED] = new Date().getTime();
			this.getDb().save(doc._id, doc._rev, doc, function(err, res) {
				if (err) {
					cb('Error updating object: ' + err);
				}
				else {
					cb(null, res);
				}
			});
		}
	});
	cb('Not implemented yet');
};


/**
 * Mark a doc as a test object.
 */
p.makeTestObject = function(obj) {
	obj.__test_object = true;
};


/**
 * Inserts all elements in a collection into the couchdb.
 * All elements in the collection must provide a toDoc() function.
 */
p.insertDocCollection = function(collection, callback) {
	var coll = collection.slice(0); // clone collection
	var theDb = this.db;
	(function insertOne() {
		var record = coll.splice(0, 1)[0]; // get the first record of coll and reduce coll by one
		try {
			theDb.save(record.getId(), record.toDoc(), function(err) {
				if (err) { callback(err); return }
				if (coll.length == 0) {
					callback();
				} else {
					insertOne();
				}
			});
		} catch (exception) {
			callback(exception);
		}
	})();
};

p.deleteCollection = function(collection, callback) {
	var coll = collection.slice(0); // clone collection
	var theDb = this.db;
	(function deleteOne() {
		var record = coll.splice(0, 1)[0]; // get the first record of coll and reduce coll by one
		try {
			theDb.remove(record._id, record._rev, function(err) {
				if (err) { callback(err); return }
				if (coll.length == 0) {
					callback();
				} else {
					deleteOne();
				}
			});
		} catch (exception) {
			callback(exception);
		}
	})();
};

p.testDb =function() {
	var docId = 'my-doc';
	this.b.get(docId, function(er, doc) {
		if (er) {
			this.db.save({awesome: 'couch fun'}, function(er, ok) {
				if (er) throw new Error(JSON.stringify(er));
				console.log('Saved doc to the couch!');
			});
		}
		else {
			console.log('retrieved doc from the couch: ' + doc);
		}
	});
};


module.exports = DbManager;
	
