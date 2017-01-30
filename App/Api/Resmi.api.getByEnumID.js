const Knex = require('../../core/Resmi.knex');
const Mas = require('../../core/Resmi.mas');
const Messages = require('./Resmi.api.messages');

module.exports = function (Input, res, settings, available, required, maxRowsToGet, table, next) {
	/*
		Check database connection
	*/
	Knex.raw('select 1').catch(function(error) {
        res.json(Messages.DATABASE_FAIL);
        next();
        return;
	});

	/*
		Input data
	*/
	let IDs = Input.ids;
	let fields  = Input.fields;

	/*
		Inspection of the input data
	*/
    if (IDs === undefined || fields === undefined) {
        res.json(Messages.INCORRECT_QUERY);
        next();
        return;
	}
	if (/^(\d{1,},)+(\d{1,})$/.test(IDs) === true) {
		IDs = IDs.split(',');

		if (IDs.length > maxRowsToGet) {
            res.json(Messages.TOO_MANY_ROWS);
            next();
            return;
		}

		IDs = Mas.parseMasInt(IDs);

	} else if (/^\d{1,}$/.test(IDs) === true) {
		IDs = [ parseInt(IDs) ]; 

    } else {
        res.json(Messages.INCORRECT_QUERY);
        next();
        return;
	}

	fields = fields.split(',');
	if (Mas.masContains(available, fields).length === 0) {
		// If no one element from fields is not contained in availableFields
        res.json(Messages.INCORRECT_QUERY);
        next();
        return;
	}

	fields = Mas.masContains(available, fields);

	/*
		Set required fields
	*/
    for (let i = 0; i < required.length; i++) {
        fields.unshift(required[i]);
    }

	/*
		Get from the base
	*/
	Knex(table).whereIn('id', IDs).select(fields).then(function(rows) {
		let context = '';
		if (rows.length > 0) {
			context = rows;
		} else {
			context = Messages.INFO_DOESNT_EXIST;
        }
        res.json(context);
        next();
        return;
	});
};