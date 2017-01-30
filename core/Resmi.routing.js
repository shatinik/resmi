/********************************************************
* Application: Resmi Engine
* Author:      Skrypko Pavel
* File:        Resmi.routing.js
* Description: Routing of the application
*********************************************************/

const Routes = require('../App/configs/routes').routes;
const HandleAction = require('../core/controlUnits/HandledAction');
const DataQuery = require('../core/controlUnits/DataQuery');

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
                DataQuery(Route, App);
                break;
        }
	}
};