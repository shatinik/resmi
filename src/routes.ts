import * as express  from 'express';
import log from './logger'
import * as SocketIO from 'socket.io'

class Route {
    private _method: string;
    private _uri: string;
    private _handler: string;
    private _action: string;

    public set method(val: string) { this._method = val.toLowerCase() }
    public set uri(val: string) { this._uri = val.toLowerCase() }
    public set handler(val: string) { this._handler = val.toLowerCase() }
    public set action(val: string) { this._action = val }

    public get method(): string { return this._method }
    public get uri(): string { return this._uri }
    public get handler(): string { return this._handler }
    public get action(): string { return this._action }

    public get filename(): string { return `./handlers/${this.handler}/${this.handler}.${this.method}` }
    public get className(): string { return this.handler.charAt(0).toUpperCase() + this.handler.slice(1).toLowerCase() + this.method.charAt(0).toUpperCase() + this.method.slice(1).toLowerCase() }

    constructor(data) {
        Object.assign(this, data);
    }
}

const routes: Route[] = require('../configs/routes');

export default class Routes {

    public static load(app: express.Application, socket: SocketIO.Server): void {
        let socketRoutes = [];
        for (let i in routes) {
            let route = new Route(routes[i]);
            if (route.method == 'socket') {
                socketRoutes.push(route);
            } else {
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
                        log.warn('router', `Route(id: ${i}) assigned to wrong http-method/socket`);
                }
            }
        }
        Routes.loadSocket(socket, socketRoutes);
    }

    private static buildAction(route: Route, socket?: SocketIO.Socket) {
        if (socket) {
            return function (data) {
                log.debug('router', `Call ${route.className}::${route.action} from ${socket.request.connection.remoteAddress}`);
                let handler = require(route.filename)[route.className].runSocket(data, route.handler, route.action, socket);
            }
        } else {
            return function (req, res, next) {
                log.debug('router', `Call ${route.className}::${route.action} from ${req.connection.remoteAddress}`);
                let handler = require(route.filename)[route.className].run(req, res, next, route.handler, route.action);
            }
        }
    }

    private static toCamelCase(...args: string[]): string {
        let text = args[0];
        for (let i = 1; i < args.length; i++) {
            text += args[i].charAt(0).toUpperCase() + args[i].slice(1).toLowerCase();
        }
        return text;
    }

    private static loadSocket(socket: SocketIO.Server, arr: Route[]) {
        socket.on('connection', (socket: SocketIO.Socket) => {
            for (let i = 0; i < arr.length; i++) {
                let action = Routes.buildAction(arr[i], socket);
                socket.on(arr[i].uri, action);
            }
        });
    }
}