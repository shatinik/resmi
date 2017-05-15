const api = require('../_resmi/api');

module.exports = {
    getInfo: function (req, res, next) {
        api.query('room#getInfo', req, res, next, function(req, res, next, rows) {
            res.json({
                "kind": global.service + '#' + 'room' + 'getInfo' + 'Response',
                "items": rows
            });
            next();
        })
    }
}