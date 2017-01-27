module.exports = {

	main: function(req, res, next) {
        res.send('This is a main page');
	},

	second: function(req, res, next) {
		res.send('This is a second page');
	}

};