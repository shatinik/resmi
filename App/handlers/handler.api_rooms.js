const Api = require('../../core/Api/Resmi.api');
const Nconf = require('nconf');

module.exports = {
	
	main: function(req, res, next) {
		Api.call(req, res, next, 'roomsByEnumID');
	},
	
	onemore: function(req, res, next) {
		Nconf.env().argv();
		var test = Nconf.file({ file: './App/controllers/test.json' });
		res.json(test.get('aza'));
	}

};