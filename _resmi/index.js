const express = require('express');
const log = require('logger');

const port = 1337;
const serverStartType = process.env.NODE_ENV || 'development';

var app = express();

function callback(req, res, next) {

}

app.listen(port, function () {
    log.info('system', `Server is running on port ${port} in ${serverStartType} mode.`);
});