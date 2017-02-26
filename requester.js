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
    query: function (_title, req, res, next, attributes) {
        let request = this.querybyname(_title);
        if (!request) {
            return false;
        }
        let query = Knex(request.table);
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
        query.then(function (rows) {
            res.json(rows);
            next();
        });
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