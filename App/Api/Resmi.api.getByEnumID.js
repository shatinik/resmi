const Knex = require('../../core/Resmi.knex');
const Mas = require('../../core/Resmi.mas');
const Messages = require('./Resmi.api.messages');

module.exports = function (Input, res, settings, available, required, maxRowsToGet, table) {
	/*
		Check database connection
	*/
	Knex.raw('select 1').catch(function(error) {
        return Messages.DATABASE_FAIL;
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
        return Messages.INCORRECT_QUERY;
	}
	if (/^(\d{1,},)+(\d{1,})$/.test(IDs) === true) {
		IDs = IDs.split(',');

		if (IDs.length > maxRowsToGet) {
            return Messages.TOO_MANY_ROWS;
		}

		IDs = Mas.parseMasInt(IDs);

	} else if (/^\d{1,}$/.test(IDs) === true) {
		IDs = [ parseInt(IDs) ]; 

    } else {
        return Messages.INCORRECT_QUERY;
	}

	fields = fields.split(',');
	if (Mas.masContains(available, fields).length === 0) {
		// If no one element from fields is not contained in availableFields
        return Messages.INCORRECT_QUERY;
	}

	fields = Mas.masContains(available, fields);

	/*
		Set required fields
	*/
	for (let i = 0; i < required.length; i++) {
		fields = Mas.pushFirst(fields, required[i]);	
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
        return;
	});
};