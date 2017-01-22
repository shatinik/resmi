/********************************************************
* Application: Resmi Engine
* Author:      Skrypko Pavel
* File:        Resmi.routing.js
* Description: Routing of the application
*********************************************************/

const Routes = require('../App/configs/routes').routes;

module.exports.Init = function(App) {

	/*
	* Routing
	*/
	var routesCount = Routes.length,
		controller = null,
		path = null;

	// Controllers, that using in routing
	var controllers = {};
	for (let i = 0; i < routesCount; i++) {

		for (let key in controllers) {
			if (key === Routes[i].controller) {
				break;
			}
		}

		controllers[Routes[i].controller] = {};
		controllers[Routes[i].controller].module = require(`../App/controllers/controller.${Routes[i].controller}.js`);
	}

	for (let i = 0; i < routesCount; i++) {
		
		if (Routes[i].enable === false) {
			continue;
		}
		
		App[Routes[i].type](Routes[i].path, function(req, res, next) {
			controllers[Routes[i].controller].module[Routes[i].defaultAction](req, res, next);
		});

		if (Routes[i].enableAllActions === true) {
			for (let key in controllers[Routes[i].controller].module) {
				if (Routes[i].defaultAction === key) {
					continue;
				}

				if (Routes[i].path === '/') {
					path = Routes[i].path + key;
				} else {
					path = Routes[i].path + `/${key}`;
				}

				App[Routes[i].type](path, function(req, res, next) {
					controllers[Routes[i].controller].module[key](req, res, next);
				});
			}
		}
	}	

	/*
	* Code 404
	*/
	App.use(function(req, res, next) {
	    res.send('404');
	});
};