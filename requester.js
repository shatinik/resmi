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
    query: function (title, req, res, next, where, callback, _parent, _w, _f, _c) {
        if (_parent && !_f) {
            console.log(`Error. Subquery can't be loaded without field name assigned to it`);
            return false;
        }
        let request = this.querybyname(title);
        if (!request) {
            return false;
        }
        let query = knex(request.table);
        if (request.fields && request.fields.length > 0) {
            let count = request.fields.length;
            for (let i = 0; i < count; i++) {
                query.select(request.fields[i]);
            }
        }
        let _where = [];
        if (request.where) {
            Object.keys(request.where).forEach(function (val) {
                _where[val] = request.where[val];
            });
        }
        if (where) {
            for (let field in where) {
                _where[field] = where[field];
            }
        }
        let static = {};
        let subquery = false;
        let subquery_field = '';
        for (let field in _where) {
            let value = _where[field].value;
            let type = _where[field].type;
            switch (type) {
                case 'var':
                case 'variable':
                    if (req.query[value]) {
                        static[field] = { type: 'static', value: req.query[value] };
                    } else {
                        res.json('ERROR'); // Недостаточно входных данных
                        next();
                        return;
                    }
                    break;
                case 'stat':
                case 'static':
                    static[field] = _where[field];
                    break;
                case 'query':
                    if (!subquery) {
                        let _subquery = _where[field];
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
                                static[field] = { type: 'static', value: values};
                                break;
                            } else {
                                subquery = _subquery;
                                subquery_field = field;
                            }
                        } else {
                            console.log(`Error. Subrequest '${field}' in '${title}' don't have a name of resulting field. Request cannot be processed`);
                            next();
                            return;
                        }
                    }
                    static[field] = _where[field];
                    break;
            }
        }
        if (subquery) {
            if (this.querybyname(subquery.value)) {
                this.query(subquery.value, req, res, next, subquery.where, function (req, res, next, rows, _title, static, field, callback) {
                    static[field].rows = rows;
                    module.exports.query(_title, req, res, next, static, callback);
                }, title, static, subquery_field, callback);
                return;
            } else {
                console.log(`Error. Request '${title}' have undefined subrequest on field '${subquery_field}'`);
                next();
                return;
            }
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
            if (_parent) {
                query.then(function (rows) {
                    callback(req, res, next, rows, _parent, _w, _f, _c);
                });
            } else {
                query.then(function (rows) {
                    callback(req, res, next, rows);
                    next();
                });
            }
        } else {
            query.then(function (rows) {
                res.json(rows);
                next();
            });
        }
    },
    querybyname: function (title) {
        for (let i = 0; i < requests.length; i++) {
            if (requests[i].title == title) {
                return requests[i];
            }
        }
        return false;
    }
};