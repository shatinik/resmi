import Packet from './packet';
import log from './logger'
import * as SocketIO from 'socket.io'

export default class Handler {

    //static obj

    beforeAction() {

    }

    constructor() {}

    static async run(req, res, next, handler, action) {
        if (!this.obj) {
            this.obj = new this();
        }
        let packet = new Packet(handler, action);
        this.obj[action](req, res, function(packet) {
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

    static async runSocket(data, handler, action, socket) {
        if (!this.obj) {
            this.obj = new this();
        }
        let packet = new Packet(handler, action);
        await this.obj[action](data, packet, socket);
    }
}