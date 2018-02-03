import Handler from '../../core/handler';
import connect from '../../core/mysql'
import log from '../../core/logger'
import Packet from '../../core/packet';
import * as SocketIO from 'socket.io'

export class RoomSocket extends Handler {
    test(data, packet, socket) {
        packet.first = data;
        socket.emit('res', packet.toJSON());
    }
}