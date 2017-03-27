﻿const requests = require('../../../configs/requests');
const routes = require('../../../configs/paths');

module.exports = {
    reqest: function (title) {
        for (let i = 0; i < requests.length; i++) {
            if (requests[i].title === title) {
                return requests[i];
            }
        }
        return false;
    },

    routes: function () {
        return routes;
    }
}