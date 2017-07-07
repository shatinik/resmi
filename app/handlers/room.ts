import * as api from '../../resmi/api';

export namespace roomHandler {
    export function getInfo(req, res, next) {
        api.query('room#getInfo', req, res, next, function (req, res, next, rows) {
            res.json({
                "kind": process.env.service + '#' + 'room' + 'getInfo' + 'Response',
                "items": rows
            });
            next();
        })
    }
}