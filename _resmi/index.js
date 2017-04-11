const express = require('express');
const log = require('logger');
const routes = require('../configs/routes');
const port = 1337;
const serverStartType = process.env.NODE_ENV || 'development';

var app = express();

app.listen(port, function () {
    log.info('system', `Server is running on port ${port} in ${serverStartType} mode.`);
});

function construct(handler, action) {
    let handle = require(`../handlers/${handler}`)[action];

    return function (req, res, next) {
        changelevel(req, res, next, before, function () {
            changelevel(req, res, next, handle, function () {
                // I could write changelevel(req, res, next, after, next)
                // But I don't care what the function returns and it'll just exec the next code
                after(req, res);
                next();
            });
        });
    }
}

function changelevel(req, res, next, from, to) {
    let result = from(req, res, to);

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

/*
* CanWeDid-function. Return false to stop the execution.
*/
function before(req, res, next) {

    let somethingWentWrong = false;

    if (somethingWentWrong) {
        return false;
    }
    
    next(); // go to handler
}

function after(req, res) {
    // Don't care what you'll do here. Answer was already send.
    // Maybe it's unusuable feature
}

for (let i in routes) {
    let route = routes[i];
    app[route.method](route.path, construct(route.handler, route.action));
}