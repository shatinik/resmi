import * as express from 'express';
import Auth from './authenticate'

export default class Application {

    private app: express.Application;
    private static _env: string;

    get express(): express.Application { return this.app }
    static get env(): string { return Application._env }

    private static initEnv(): string {
        let node_env = process.env.NODE_ENV ? process.env.NODE_ENV.toLocaleLowerCase() : '';
        if (!node_env || ( node_env != 'production' && node_env != 'test')) {
            node_env = 'development';
        }
        process.env.NODE_ENV = node_env;
        return Application._env = node_env;
    }

    constructor() {
        Application.initEnv();
        let app = this.app = express();
        app.use(function(req,res,next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });
        app.use(require('morgan')('combined'));
        app.use(require('cookie-parser')());
        app.use(require('body-parser').urlencoded({ extended: true }));
        app.use(require('body-parser').json());
        app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
        Auth.init(app);
    }
}