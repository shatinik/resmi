import { Request, Response, NextFunction  } from 'express'
import Packet from './packet';
import log from './logger'
import * as SocketIO from 'socket.io'

export default class Handler {

    protected static obj: Handler;

    protected beforeAction() {

    }

    protected constructor() {}

    public static async run(req, res: Response, next: NextFunction, handler: string, action: string) {
        if (!this.obj) {
            this.obj = new this();
        }
        let packet = new Packet(handler, action);
        this.obj[action](req, res, function(packet: Packet) {
            if (packet.error) {
                log.debug('net', packet.error);
            }
            if (req.new_token) {
                packet.token = req.new_token;
            }
            res.status(200).json(packet);
            next();
        }, packet);
    }

    public static async runSocket(data: object, handler: string, action: string, socket: SocketIO.Socket) {
        if (!this.obj) {
            this.obj = new this();
        }
        let packet = new Packet(handler, action);
        await this.obj[action](data, packet, socket);
    }
}