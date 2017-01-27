module.exports = function (Route, App) {

    var Handler = require(`../../App/handlers/handler.${Route.handler}.js`);
    var Path = '';

    for (let Action in Handler) {
        if (Route.defaultActionOnly === true && Route.defaultAction !== Action) {
            continue;
        }

        App[Route.type](Route.path, function (req, res, next) {
            Handler[Action](req, res, next);
        });

        if (Route.path[Route.path.length - 1] === '/') {
            Path = Route.path + Action;
        } else {
            Path = Route.path + `/${Action}`;
        }

        App[Route.type](Path, function (req, res, next) {
            Handler[Action](req, res, next);
        });

        if (Route.defaultActionOnly === true) {
            break;
        }
    }
}