/********************************************************
* Application: Resmi Engine
* Author:      Skrypko Pavel
* File:        Resmi.routing.js
* Description: Routing of the application
*********************************************************/

const Routes = require('../App/configs/routes').routes;
const HandleAction = require('../core/controlUnits/HandledAction');

module.exports.Init = function(App) {

	/*
	* Routing
	*/
    var routesCount = Routes.length;

	for (let i = 0; i < routesCount; i++) {

        var Route = Routes[i];

        if (Route.enabled === false) {
            continue;
        }

        switch (Route.control_module) {
            case 'HandledAction':
                HandleAction(Route, App);
                break;
            case 'DataQuery':
                break;
        }

        
	}	

	/*
	* Code 404
	*/
	App.use(function(req, res, next) {
	    res.send('404');
	});
};