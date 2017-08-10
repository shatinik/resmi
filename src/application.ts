import * as express from 'express';

export class Application {

    private app: express.Application;

    constructor() {
        this.app = express();
    }
}