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

    private initAuth(): void {
        this.express.use(require('morgan')('combined'));
        this.express.use(require('cookie-parser')());
        this.express.use(require('body-parser').urlencoded({ extended: true }));
        this.express.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
        Auth.init(this.express);
    }

    constructor() {
        this.app = express();
        this.app.use(function(req,res,next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });
        Application.initEnv();
        this.initAuth();
    }
}