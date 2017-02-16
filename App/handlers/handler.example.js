module.exports = {

	main: function(req, res, next) {
        res.send('This is a main page');
        next();
	},

	second: function(req, res, next) {
        res.send('This is a second page');
        next();
	}

};