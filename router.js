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
            if (route.action) {
                action = route.action;
            } else {
                action = 'default';
            }
        }

        if (route.request) {
            App[route.type](route.path, function (req, res, next) {
                requester.query(route.request, req, res, next, route.request_attr, route.request_stat, handler, action);
            });
        } else {
            if (handler) {
                App[route.type](route.path, function (req, res, next) {
                    handler[action](req, res, next, false);
                });
            } else {
                console.log(`Error. Route #${i} have empty handler name`);
            }
        }

        
    }
};