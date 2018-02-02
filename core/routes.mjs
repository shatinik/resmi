import express from 'express'
import log from './logger/index.mjs'
import SocketIO from 'socket.io'
import fs from 'fs'
import path from 'path'
import * as mappings from '../handlers/mappings'
import routes from '../configs/routes/routes.json'

const ROUTES_PATH = '/configs/routes/';

class Route {
    set method(val) { this._method = val.toLowerCase() }
    set uri(val) { this._uri = val.toLowerCase() }
    set handler(val) { this._handler = val.toLowerCase() }
    set action(val) { this._action = val }

    get method() { return this._method }
    get uri() { return this._uri }
    get handler() { return this._handler }
    get action() { return this._action }

    get filename() { return `../handlers/${this.handler}/${this.handler}.${this.method}` }
    get className() { return this.handler.charAt(0).toUpperCase() + this.handler.slice(1).toLowerCase() + this.method.charAt(0).toUpperCase() + this.method.slice(1).toLowerCase() }

    constructor(data) {
        Object.assign(this, data);
    }
}

export default class Routes {

    static load(app, socket) {
        let routes = Routes.loadRoutes();
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
        app.get('/documentation', (req, res, next) => {
            let body = '';
            for (let i in routes) {
                let route = new Route(routes[i]);
                if (route.method == 'socket') {
                    body += 'Socket route';
                } else {
                    let action = Routes.buildAction(route);
                    switch (route.method) {
                        case 'get':
                            body += 'Get route<br>';
                            break;
                        case 'post':
                            body += 'Post route<br>';
                            break;
                        case 'put':
                            body += 'Put route<br>';
                            break;
                        case 'delete':
                            body += 'Delete route<br>';
                            break;
                        default:
                            body += 'Unknown route<br>';
                    }
                }
            }
            res.send(body);
            next();
        })
        Routes.loadSocket(socket, socketRoutes);
    }

    static buildAction(route, socket) {
        if (socket) {
            return function (data) {
                log.debug('router', `Call ${route.className}::${route.action} from ${socket.request.connection.remoteAddress}`);
                mappings[route.className].runSocket(data, route.handler, route.action, socket);
            }
        } else {
            return function (req, res, next) {
                log.debug('router', `Call ${route.className}::${route.action} from ${req.connection.remoteAddress}`);
                mappings[route.className].run(req, res, next, route.handler, route.action);
            }
        }
    }

    static toCamelCase(...args) {
        let text = args[0];
        for (let i = 1; i < args.length; i++) {
            text += args[i].charAt(0).toUpperCase() + args[i].slice(1).toLowerCase();
        }
        return text;
    }

    static loadSocket(socket, arr) {
        socket.on('connection', (socket) => {
            for (let i = 0; i < arr.length; i++) {
                let action = Routes.buildAction(arr[i], socket);
                socket.on(arr[i].uri, action);
            }
        });
    }

    static loadRoutes() {
        let data = [],
            parent = path.normalize('/home/sam/resmi/core' + `/../${ROUTES_PATH}`);
        log.info('system', `Loading routes from ${parent}`);
        Array.prototype.push.apply(data,routes)
        /*
        function walkDir(dir) {
            let files = fs.readdirSync(dir);
            for (let i in files) {
                let file = path.join(dir, files[i]);
                if (fs.statSync(file).isFile() && path.extname(file) == '.json') {
                    import(file).then(file => Array.prototype.push.apply(data,file))
                    log.info('system', `File ${file.replace(parent, '')} loaded as router`);
                } else if (fs.statSync(file).isDirectory()) {
                    walkDir(file);
                }
            }
        }
        walkDir(parent);
        fs.readdirSync(parent).forEach(function (file) {
            import(parent + file).then(file => Array.prototype.push.apply(data,file))
            log.info('system', `File ${file} loaded as router`);
        });
        */
        return data;
    }
}