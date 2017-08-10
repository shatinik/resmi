import { Request, Response, NextFunction  } from 'express'

export class Handler {

    protected static obj: Handler;

    protected beforeAction() {

    }

    protected constructor() {}

    public static run(req: Request, res: Response, next: NextFunction, action: string) {
        if (!this.obj) {
            this.obj = new this();
        }
        this.obj[action](req, res, next);
    }
}