const routes = require('./configs/paths');
const requester = require('./requester');

/*
const HandleAction = require('../core/controlUnits/HandledAction');
const DataQuery = require('../core/controlUnits/DataQuery');
*/

module.exports = function (App) {

    let count = routes.length;

    for (let i = 0; i < count; i++) {

        let route = routes[i];
        
        if (route.disabled) {
            continue;
        }

        let handler = false;
        let action = false;

        if (route.handler) {
            handler = require(`./handlers/${route.handler}`);

            if (!route.action && !handler['default']) {
                console.log(`Error. Route #${i} links to invalid action and handler haven't default action`);
                continue;
            } else if (!handler[route.action]) {
                console.log(`Notice. Route #${i} links to invalid action. Default action will be loaded`);
                action = 'default';
            } else {
                action = route.action;
            }
        }

        if (route.request) {
            App[route.type](route.path, function (req, res, next) {
                requester.query(route.request, req, res, next, handler[action], route.where);
            });
        } else {
            if (handler) {
                App[route.type](route.path, function (req, res, next) {
                    handler[action](req, res, next, false);
                });
            } else {
                console.log(`Error. Route #${i} is invalid`);
            }
        }

        
    }
};