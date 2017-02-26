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
    query: function (_title, req, res, next, where, callback) {
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
        for (let field in _where) {
            let value = _where[field].value;
            let type = _where[field].type;
            switch (type) {
                case 'var':
                case 'variable':
                    if (req.query[value]) {
                        query.where(field, req.query[value]);
                    } else {
                        res.json('ERROR'); // Недостаточно входных данных
                        next();
                        return;
                    }
                    break;
                case 'stat':
                case 'static':
                    query.where(field, value);
                    break;
                case 'query':
                    break;
            }
        }
        if (callback) {
            query.then(function (rows) {
                callback(req, res, next, rows);
                next();
            });
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