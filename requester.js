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
    query: function (_title, req, res, next, attributes, handler, action) {
        let request = this.querybyname(_title);
        if (!request) {
            return false;
        }
        let query = knex(request.table);
        let _attributes = request.attributes;
        if (attributes) {
            for (let field in attributes) {
                _attributes[field] = attributes[field];
            }
        }
        for (let field in _attributes) {
            let value = request.attributes[field];
            query.where(field, req.query[value]);
        }
        for (let field in request.static) {
            let value = request.static[field];
            query.where(field, value);
        }
        if (handler) {
            if (!handler[action]) {
                action = 'default';
            }
            if (handler[action]) {
                query.then(function (rows) {
                    handler[action](req, res, next, rows);
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