const express = require('express');
const log = require('logger');
const routes = require('../configs/routes');
const port = 1337;
const serverStartType = process.env.NODE_ENV || 'development';
const events = require('./events');

var app = express();

app.listen(port, function () {
    log.info('system', `Server is running on port ${port} in ${serverStartType} mode.`);
});

function construct(handler, action, route) {
    let handle = require(`../handlers/${handler}`)[action];

    return function (req, res, next) {
        changelevel(req, res, next, events.before, function () {
            changelevel(req, res, next, handle, function () {
                // I could write changelevel(req, res, next, after, next)
                // But I don't care what the function returns and it'll just exec the next code
                event.after(req, res);
                next();
            }, route);
        }, route);
    }
}

function changelevel(req, res, next, from, to, route) {
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

for (let i in routes) {
    let route = routes[i];
    app[route.method](route.uri, construct(route.handler, route.action, route));
}