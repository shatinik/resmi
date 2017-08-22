import { Request, Response, NextFunction  } from 'express'
import Packet from './packet';
import log from './logger'

export default class Handler {

    protected static obj: Handler;

    protected beforeAction() {

    }

    protected constructor() {}

    public static run(req: Request, res: Response, next: NextFunction, handler: string, action: string) {
        if (!this.obj) {
            this.obj = new this();
        }
        let packet = new Packet(handler, action);
        this.obj[action](req, res, function(packet: Packet) {
            if (packet.error) {
                log.debug('net', packet.error);
            }
            res.status(packet.status).json(packet);
            next();
        }, packet);
    }
}