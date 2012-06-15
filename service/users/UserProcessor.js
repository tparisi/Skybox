var pw = require('./password');
var globals = require('./Globals');

exports.process = function(record) {
	if (record.type == globals.TYPE_USER) {
		record.password = pw.hash(record.password);
	}
}
