global.env = global.process.env.NODE_ENV || 'development';
global.service = 'videosos';

const express = require('express');
const log = require('./logger');
const routes = require('../configs/routes');
const events = require('./events');

module.exports = function(port) {
    var app = express();
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
    app.listen(port, function () {
        log.info('system', `Server is running on port ${port} in ${global.env} mode.`);
    });
}