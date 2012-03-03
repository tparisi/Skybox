
exports.isEmpty = function(obj) {
	return JSON.stringify(obj) === '{}';
};

/**
 * Adds a flag to an object that marks it as a test object (for easy deletion of test data).
 */
exports.makeTestObject = function(obj) {
	obj.isTestObject = true;
};

exports.merge = function(current, modified, fields) {
		for (i in fields) {
			mergeField(fields[i], current, modified);
		}
		return current;
};


function mergeField(fieldName, current, modified) {
	if (!modified[fieldName] && current[fieldName]) {
		delete current[fieldName];
	}
	else {
		current[fieldName] = modified[fieldName];
	}
}


/**
 * Remove/replace internal properties (_id, _rev).
 * Recurses through entire object.
 */
exports.cleanseInternalPropsRecursive = function(obj) {
	if (!obj || typeof(obj) != 'object' || exports.isEmpty(obj)) {
		return obj;
	}
	var cleansed;
	if (obj instanceof Array) {
		cleansed = new Array();
	}
	else {
		cleansed = {};
	}
	for (prop in obj) {
		var val = obj[prop];
		if (prop == '_rev' || !obj.hasOwnProperty(prop)) {
			continue;
		}/*
		else if (prop == '_id') {
			cleansed.id = val;
		}*/
		else if (val != null && typeof(val) == 'object' && !exports.isEmpty(val)) {
			cleansed[prop] = exports.cleanseInternalPropsRecursive(val);
		}
		else {
			cleansed[prop] = val;
		}
	}
	return cleansed;
};

/**
 * Remove/replace internal properties (_id, _rev).
 * Non-recursive.
 */
exports.cleanseInternalProps = function(obj) {
	var cleansed = {};

	for (prop in obj) {
		if (prop == '_rev' || !obj.hasOwnProperty(prop)) {
			continue;
		}
		else if (prop == '_id') {
			cleansed.id = obj[prop];
		}
		else {
			cleansed[prop] = obj[prop];
		}
	}

	return cleansed;
};