/********************************************************
* Application: Resmi Engine
* Author:      Skrypko Pavel
* File:        Resmi.main.js
* Description: The initialization script of the engine
*********************************************************/

/*
*	Main requires
*/
const Express      = require('express');
const Compression  = require('compression');
const ResmiRouting = require('./Resmi.routing');

/*
* Server configuration process.env.NODE_ENV;
*/
var serverStartType = process.env.NODE_ENV || 'development';
const ServerConf = require(`./configs/server.${serverStartType}.js`);

/*
* Main constants
*/
const App = Express();

/*
* Middleware
*/
App.use(function (req, res, next) {
    req.execute = true;
    req.executed = false; // Will set to `true` if request will be processed
    next();
});
App.use(Compression()); // Compression
ResmiRouting.Init(App); // Routing
App.use(function (req, res, next) {
    if (!req.executed) {
        res.send('404');
    }
    next();
});

/*
* Server listen
*/
App.listen(ServerConf.port, function() {
	console.log(`Server is running on port ${ServerConf.port} in ${serverStartType} mode.`);
});
