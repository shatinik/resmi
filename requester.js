const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'videosos',
        charset: 'utf8'
    }
});
const requests = require('./configs/requests');

module.exports = {
    loadConditions: function (req, res, next, title, where, callback) {
        let static = {};
        let subquery = false;
        let subquery_field = '';
        for (let field in where) {
            let value = where[field].value;
            let type = where[field].type;
            switch (type) {
                case 'var':
                case 'variable':
                    if (req.query[value]) {
                        static[field] = { type: 'static', value: req.query[value] };
                    } else {
                        next(); // Error::NotEnoughData
                        return false;
                    }
                    break;
                case 'stat':
                case 'static':
                    static[field] = where[field];
                    break;
                case 'query':
                    if (!subquery) {
                        let _subquery = where[field];
                        if (_subquery.field) {
                            if (_subquery.rows) {
                                let count = _subquery.rows.length;
                                let values = [];
                                for (let i = 0; i < count; i++) {
                                    values[i] = _subquery.rows[i][_subquery.field];
                                }
                                if (values.count == 1) {
                                    values = values[0];
                                }
                                static[field] = { type: 'static', value: values };
                                break;
                            } else {
                                subquery = _subquery;
                                subquery_field = field;
                            }
                        } else {
                            console.log(`Error. Subrequest '${field}' in '${title}' don't have a name of resulting field. Request cannot be processed`);
                            next();
                            return false;
                        }
                    }
                    static[field] = where[field];
                    break;
            }
        }
        if (subquery) {
            if (this.getConfig(subquery.value)) {
                this.query(subquery.value, req, res, next, function (req, res, next, rows) {
                    static[subquery_field].rows = rows;
                    module.exports.query(title, req, res, next, callback, static);
                }, subquery.where);
            } else {
                console.log(`Error. Request '${title}' have undefined subrequest on field '${subquery_field}'`);
                next();
            }
            return false;
        }
        return static;
    },
    query: function (title, req, res, next, callback, _w) {
        let request = this.getConfig(title);
        let table = request.table;
        let type = request.type;
        let where = {};
        let fields = request.fields;
        let query = knex(table);

        if (request.where) {
            where = Object.assign(request.where);
        }
        if (where) {
            where = Object.assign(where, _w);
        }
        let static = this.loadConditions(req, res, next, title, where, callback);
        if (static) {
            switch (type) {
                case 'select':
                    if (fields && fields.length > 0) {
                        let count = fields.length;
                        for (let i = 0; i < count; i++) {
                            query.select(fields[i]);
                        }
                    }
                    break;
                case 'insert':
                    break;
                case 'update':
                    break;
                case 'delete':
                    break;
            }
            for (let field in static) {
                let value = static[field].value;
                if (value instanceof Array) {
                    query.whereIn(field, value);
                } else {
                    query.where(field, value);
                }
            }
            if (callback) {
                query.then(function (rows) {
                    callback(req, res, next, rows);
                });
            } else {
                query.then(function (rows) {
                    res.json(rows);
                    next();
                });
            }
        }
    },
    getConfig: function (title) {
        for (let i = 0; i < requests.length; i++) {
            if (requests[i].title == title) {
                return requests[i];
            }
        }
        return false;
    }
};