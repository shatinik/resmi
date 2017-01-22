const Knex = require('../Resmi.knex');
const Mas  = require('../Resmi.mas');
const Messages = require('./Resmi.api.messages');

module.exports = function(req, res, next, settings) {
	/*
		Check database connection
	*/
	Knex.raw('select 1').catch(function(error) {
		res.json(Messages.DATABASE_FAIL);
		return;
	});
	
	/*
		Config fields
	*/
	let availableFields = settings.availableFields;
	let requiredFields  = settings.requiredFields;
	let maxRowsToGet    = settings.maxRowsToGet;
	let tableTitle      = settings.tableTitle;

	/*
		Input data
	*/
	let IDs = req.query[settings.fields.ids];
	let fields  = req.query[settings.fields.fields];

	/*
		Inspection of the input data
	*/
	if (IDs === undefined || fields === undefined) {
		res.json(Messages.INCORRECT_QUERY);
		return;
	}
	if (/^(\d{1,},)+(\d{1,})$/.test(IDs) === true) {
		IDs = IDs.split(',');

		if (IDs.length > maxRowsToGet) {
			res.json(Messages.TOO_MANY_ROWS);
			return;
		}

		IDs = Mas.parseMasInt(IDs);

	} else if (/^\d{1,}$/.test(IDs) === true) {
		IDs = [ parseInt(IDs) ]; 

	} else {
		res.json(Messages.INCORRECT_QUERY);
		return;
	}

	fields = fields.split(',');
	if (Mas.masContains(availableFields, fields).length === 0) {
		// If no one element from fields is not contained in availableFields
		res.json(Messages.INCORRECT_QUERY);
		return;
	}

	fields = Mas.masContains(availableFields, fields);

	/*
		Set required fields
	*/
	for (let i = 0; i < requiredFields.length; i++) {
		fields = Mas.pushFirst(fields, requiredFields[i]);	
	}

	/*
		Get from the base
	*/
	Knex(tableTitle).whereIn('id', IDs).select(fields).then(function(rows) {
		let context = '';
		if (rows.length > 0) {
			context = JSON.parse(JSON.stringify(rows));
		} else {
			context = Messages.INFO_DOESNT_EXIST;
		}
		res.json(context);
		return;
	});
};