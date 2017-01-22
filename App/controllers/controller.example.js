const Models = require('../../core/Resmi.bookshelf').models;

module.exports = {

	main: function(req, res, next) {

		Models.user.count().then(function(count) {
			// console.log(count);
		});

		res.send('This is a main page');
	},

	second: function(req, res, next) {
		res.send('This is a second page');
	}

};