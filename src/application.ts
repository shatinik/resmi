import * as express from 'express';

export default class Application {

    private app: express.Application;
    private _env: string;

    get express(): express.Application { return this.app }
    get env(): string { return this._env }


    initEnv(): string {
        let node_env = process.env.NODE_ENV ? process.env.NODE_ENV.toLocaleLowerCase() : '';
        if (!node_env || ( node_env != 'production' && node_env != 'test')) {
            node_env = 'development';
        }
        process.env.NODE_ENV = node_env;
        return this._env = node_env;
    }

    constructor() {
        this.app = express();
        this.initEnv();
    }
}