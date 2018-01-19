import Handler from '../../core/handler';
import connect from '../../core/mysql'
import Room from '../../models/mysql/Room';
import log from '../../core/logger'
import Packet from '../../core/packet';
import User from '../../models/mysql/User';

export class RoomDelete extends Handler {
    deleteById(req, res, next, packet) {
        let id = NaN;

        if (!req.query.id) {
            packet.error = 'Not enough data';
        } else {
            id = Number(req.query.id);
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
                        packet.error = `No room with ID ${id}`;
                    } else {
                        await roomRepository.remove(room);
                    }
                }
                next(packet);
            })
        }
    }

    deleteAllByCreatorId(req, res, next, packet) {
        let creator_id = NaN;

        if (!req.query.creator) {
            packet.error = 'Not enough data';
        } else {
            creator_id = Number(req.query.creator);
            if (isNaN(creator_id)) {
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
                    let userRepository = connection.getRepository(User);
                    let creator = await userRepository.findOneById(creator_id);
                    if (!creator) {
                        packet.error = `No user with id ${creator_id}`;
                    } else {
                        let roomRepository = connection.getRepository(Room);
                        let data = await roomRepository.find({creator: creator});
                        if (data.length == 0) {
                            packet.error = `No rooms with creator_id ${creator_id}`;
                        } else {
                            await roomRepository.remove(data);
                        }
                    }
                }
                next(packet);
            })
        }
    }
}