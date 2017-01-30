const _Api = require('../../App/configs/api');

module.exports = function (Route, App) {

    if (Route.enabled === false) {
        return;
    }

    App[Route.type](Route.path, function (req, res, next) {
        req.executed = true;
        var Api = _Api[Route.query];
        var Unit = require(`../../App/Api/Resmi.api.${Api.Unit}`);
        var Input = {};
        for (let _field in Api.fields) {
            let field = Api.fields[_field];
            Input[_field] = req.query[field];
        }
        var Result = Unit(Input, res, Api, Api.availableFields, Api.requiredFields, Api.maxRowsToGet, Api.tableTitle);
        if (Result)
            res.json(Result);
        next();
    });
};