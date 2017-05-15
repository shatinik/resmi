const express = require('express');
const log = require('logger');
const routes = require('../configs/routes');
const serverStartType = process.env.NODE_ENV || 'development';
const events = require('./events');

global.service = 'videosos';

function construct(handler, action, route) {
    let handle = require(`../handlers/${handler}`)[action];

    return function (req, res, next) {
        let _if = changelevel(req, res, next, route);
        
        _if(events.before) (function(){
            _if(handle) (function(){
                // I could write _if(events.after)(next)
                // But I don't care what the function returns and it'll just exec the next code
                events.after(req, res);
                next();
            });
        });
    }
}

function changelevel(req, res, next, route) {
    return function (from) {
        return function (to) {
            _changelevel(req, res, next, from, to, route);
        }
    }
}

function _changelevel(req, res, next, from, to, route) {
    let result = from(req, res, to, route);

    if (result === true) {
        // all OK. Answer has been send
    } else if (result === undefined) {
        // no info. Processing is going to deep levels. nothing to do.
        // Answer might be already sended. Not sure.
    } else if (result === false) {
        // bad news. Something going wrong and we can't process it.
        next(); // looks like it'll be a 404-page
    }
}

module.exports = function(port) {
    var app = express();

    app.listen(port, function () {
        log.info('system', `Server is running on port ${port} in ${serverStartType} mode.`);
    });

    for (let i in routes) {
        let route = routes[i];
        
        switch (route.method) {
            case 'get':
                app.get(route.uri, construct(route.handler, route.action, route));
                break;
            case 'post':
                app.post(route.uri, construct(route.handler, route.action, route));
                break;
            case 'put':
                app.put(route.uri, construct(route.handler, route.action, route));
                break;
            case 'delete':
                app.delete(route.uri, construct(route.handler, route.action, route));
                break;
            default:
                log.warn('router', `Route(id: ${i}) have an unexpectable method`);
        }
    }
}