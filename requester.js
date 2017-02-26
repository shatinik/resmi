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
    query: function (_title, req, res, next, attributes, static, handler, action) {
        let request = this.querybyname(_title);
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
        let _attributes = [];
        if (request.attributes) {
            _attributes = request.attributes;
        }
        if (attributes) {
            for (let field in attributes) {
                _attributes[field] = attributes[field];
            }
        }
        for (let field in _attributes) {
            let value = _attributes[field];
            query.where(field, req.query[value]);
        }
        let _static = [];
        if (request.static) {
            _static = request.static;
        }
        if (static) {
            for (let field in static) {
                _static[field] = static[field];
            }
        }
        for (let field in _static) {
            let value = _static[field];
            query.where(field, value);
        }
        if (handler) {
            if (!handler[action]) {
                action = 'default';
            }
            if (handler[action]) {
                query.then(function (rows) {
                    handler[action](req, res, next, rows);
                    next();
                });
            } else {
                query.then(function (rows) { // no default action in handler
                    res.json('ERROR');
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