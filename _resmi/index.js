const express = require('express');
const log = require('logger');
const routes = require('../configs/routes');
const events = require('./events');

global.service = 'videosos';

module.exports = function(port) {
    var app = express();
    app.listen(port, function () {
        log.info('system', `Server is running on port ${port} in ${app.get('env')} mode.`);
    });
    app.use(events.before);
    for (let i in routes) {
        let route = routes[i];
        let handle = require(`../handlers/${route.handler}`)[route.action];
        switch (route.method) {
            case 'get':
                app.get(route.uri, handle);
                break;
            case 'post':
                app.post(route.uri, handle);
                break;
            case 'put':
                app.put(route.uri, handle);
                break;
            case 'delete':
                app.delete(route.uri, handle);
                break;
            default:
                log.warn('router', `Route(id: ${i}) have an unexpectable method`);
        }
    }
    app.use(events.after);
}