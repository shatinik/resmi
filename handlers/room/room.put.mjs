import Handler from '../../core/handler';
import connect from '../../core/mysql'
import Room from '../../models/mysql/Room';
import log from '../../core/logger'
import Packet from '../../core/packet';
import User from '../../models/mysql/User';

export class RoomPut extends Handler {

    async editById(req, res, next, packet) {
        /*
            Обновление информации о комнате по её Id
        */
        let user = req.user;
        let roomId = req.query.id;
        let title = req.query.title;
        let picture_uri = req.query.picture_uri;
        let global_uri = req.query.global_uri;

        if (!roomId) {
            packet.error = 'Not enough data';
        }

        if (!packet.error) {
            let room = await Room.findOne({_id: roomId});
            if (!room) {
                packet.error = `No room with id ${roomId}`;
            } else {
                if (room.creator !== user) {
                    packet.error = 'Access denied';
                } else {
                    room.title = title || room.title;
                    room.picture_uri = picture_uri || room.picture_uri;
                    room.global_uri = global_uri || room.global_uri; // VIP-only
                    await room.save();
                    packet.first = 'Ok';
                }
            }
        }
        next(packet);
    }
}