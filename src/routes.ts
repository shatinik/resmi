import * as express  from 'express';
import log from './logger'

declare interface route {
    method: string,
    uri: string,
    handler: string,
    action: string
}
const routes: route[] = require('../configs/routes');

export default class Routes {

    public static load(app: express.Application): void {
        for (let i in routes) {
            let route = routes[i];
            let action = Routes.buildAction(route);
            switch (route.method) {
                case 'get':
                    app.get(route.uri, action);
                    break;
                case 'post':
                    app.post(route.uri, action);
                    break;
                case 'put':
                    app.put(route.uri, action);
                    break;
                case 'delete':
                    app.delete(route.uri, action);
                    break;
                default:
                    log.warn('router', `Route(id: ${i}) assigned to wrong http-method`);
            }
        }
    }

    private static buildAction(route: route) {
        let fileName = `./handlers/${route.handler}/${route.handler}.${route.method}`;
        let handlerName = Routes.toCamelCase(route.handler, route.method);
        let actionName = route.action;
        return function (req, res, next) {
            let handler = new (require(fileName)[handlerName])(req, res, next, actionName);
            log.debug('router', `Call ${handlerName}::${actionName} from ${req.connection.remoteAddress}`);
        }
    }

    private static toCamelCase(...args: string[]): string {
        let text = args[0];
        for (let i = 0; i < args.length; i++) {
            text += args[i].charAt(0).toUpperCase() + args[i].slice(1).toLowerCase();
        }
        return text;
    }
}