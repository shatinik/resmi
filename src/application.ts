import * as express from 'express';
import Auth from './authenticate'

export default class Application {

    private app: express.Application;
    private _env: string;

    get express(): express.Application { return this.app }
    get env(): string { return this._env }


    private initEnv(): string {
        let node_env = process.env.NODE_ENV ? process.env.NODE_ENV.toLocaleLowerCase() : '';
        if (!node_env || ( node_env != 'production' && node_env != 'test')) {
            node_env = 'development';
        }
        process.env.NODE_ENV = node_env;
        return this._env = node_env;
    }

    private initAuth(): void {
        new Auth(this.express);
    }

    constructor() {
        this.app = express();
        this.app.use(function(req,res,next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });
        this.initEnv();
        this.initAuth();
    }
}