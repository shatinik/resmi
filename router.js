const routes = require('./configs/paths');
const requester = require('./requester');

/*
const HandleAction = require('../core/controlUnits/HandledAction');
const DataQuery = require('../core/controlUnits/DataQuery');
*/

module.exports = function (App) {

    var count = routes.length;

    for (let i = 0; i < count; i++) {

        var route = routes[i];

        if (route.disabled) {
            continue;
        }

        let handler = false;
        let action = false;

        if (route.handler !== '') {
            handler = require(`./handlers/${route.handler}`);
            if (route.action !== '') {
                action = route.action;
            } else {
                action = 'default';
            }
        }

        if (route.request) {
            App[route.type](route.path, function (req, res, next) {
                requester.query(route.request, req, res, next, route.request_attr, handler, action);
            });
        } else {
            App[route.type](route.path, function (req, res, next) {
                handler[action](req, res, next, false);
            });
        }

        
    }
};