import * as express from 'express';

export class Core {

    private _app: express.Application;

    public get app(): express.Application { return this._app; }
    public set app(app: express.Application) { this._app = app }

    constructor() {
        this.app = express();
    }

    private loadModules() {
        // this.app.use(bodyParser.urlencoded({ extended: true }));
        // this.app.use(bodyParser.json());
        // this.app.use(logger('dev'));
    }

    private loadRoutes() {

    }
}