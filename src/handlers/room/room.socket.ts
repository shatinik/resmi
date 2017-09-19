import Handler from '../../resmi/handler';
import connect from '../../resmi/database/mysql'
import { Connection } from 'typeorm';
import log from '../../logger'
import Packet from '../../resmi/packet';
import * as SocketIO from 'socket.io'

export class RoomSocket extends Handler {

    public test(data: object, packet: Packet<any>, socket: SocketIO.Socket): void {
        packet.first = data;
        socket.emit('res', packet.toJSON());
    }
}