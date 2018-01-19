import Handler from '../../core/handler';
import connect from '../../core/mysql'
import Room from '../../models/mysql/Room';
import log from '../../core/logger'
import Packet from '../../core/packet';
import User from '../../models/mysql/User';

export class RoomPut extends Handler {

    editById(req, res, next, packet) {
        /*
            Обновление информации о комнате по её Id
        */
        let user = req.user;
        let id = NaN;
        let title = '';
        let picture_uri = '';
        let global_uri = '';

        if (!req.query.id) {
            packet.error = 'Not enough data';
        } else {
            id = Number(req.query.id);
            title = req.query.title;
            picture_uri = req.query.picture_uri;
            global_uri = req.query.global_uri;
            if (isNaN(id)) {
                packet.error = 'ID is NaN';
            }
        }

        if (packet.error) {
            next(packet);
        } else {
            connect.then(async connection => {
                if (!connection || !connection.isConnected) {
                    log.error('typeorm', 'DBConnection error');
                    packet.error = 'Internal error';
                } else {
                    let roomRepository = connection.getRepository(Room);
                    let room = await roomRepository.findOneById(id);
                    if (!room) {
                       packet.error = `No room with id ${id}`;
                    } else {
                        if (room.creator !== user) {
                            packet.error = 'Access denied';
                        } else {
                            room.title = title || room.title;
                            room.picture_uri = picture_uri || room.picture_uri;
                            room.global_uri = global_uri || room.global_uri; // VIP-only
                            await roomRepository.save(room);
                            packet.first = 'Ok';
                        }
                    }
                }
                next(packet);
            })
        }
    }
}