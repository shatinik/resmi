const Knex = require('../../core/Resmi.knex');
const Mas = require('../../core/Resmi.mas');
const Messages = require('../Api/Resmi.api.messages');

module.exports = {

	edit: function(req, res, next) {

        /*
		Check database connection
	*/
        Knex.raw('select 1').catch(function (error) {
            res.json(Messages.DATABASE_FAIL);
            next();
            return;
        });

        /*
            Input data
        */
        let id = req.query['id'];
        let Title = req.query['title'];

        /*
            Inspection of the input data
        */
        if (id === undefined || Title === undefined) {
            res.json(Messages.INCORRECT_QUERY);
            next();
            return;
        }
        
        /*
            Update table
        */
        Knex('rooms').where('id', id).update({ title: Title }).then();
        res.json(Messages.OK);
        next();
	},

};