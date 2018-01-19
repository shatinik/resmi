import Handler from '../../core/handler';
import connect from '../../core/mysql'
import Room from '../../models/mysql/Room';
import log from '../../core/logger'
import Packet from '../../core/packet';
import User from '../../models/mysql/User';

export class RoomGet extends Handler {

    isRoomExist(req, res, next, packet) {
        /*
            Существует ли комната
            api.site.com/v1/room/isRoomExist?id=1
        */
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
                    let data = await roomRepository.findOneById(id);
                    packet.first = !!data;
                }
                next(packet);
            });
        }
    }
    
    getInfoById(req, res, next, packet) {
        /*
            Берётся информация о комнате
            api.site.com/v1/room/getInfoById?id=1&items=title,picture_uri,creator,current_video ...
        */
        let id = NaN;
        let items = [];

        if (!req.query.id || !req.query.items) {
            packet.error = 'Not enough data';
        } else {
            id = Number(req.query.id);
            items = req.query.items.split(',');
            if (isNaN(id)) {
                packet.error = 'ID is NaN';
            }
        }

        if (packet.error) {
            next(packet)
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
                        packet.first = {};
                        for (let i = 0; i < items.length; i++) {
                            packet.first[items[i]] = room[items[i]]; // insecure. need to filter accessible fields
                        }
                    }
                    next(packet);
                }
            });
        }
    }

    getAllByCreatorId(req, res, next, packet) {
        /*
            Возвращается список всех комнат по id создателя
            api.site.com/v1/room/getAllByCreatorId?creator=1&items=title,picture_uri,author,current_video ...
        */
        let creator_id = NaN;
        let items = [];

        if (!req.query.creator || !req.query.items) {
            packet.error = 'Not enough data';
        } else {
            creator_id = Number(req.query.creator);
            items = req.query.items.split(',');
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
                        let rooms = await roomRepository.find({creatorId: creator.id});
                        if (rooms.length == 0) {
                            packet.error = `No rooms with creator ${creator_id}`;
                        } else {
                            packet.items = [];
                            for (let i = 0; i < rooms.length; i++) {
                                packet.items[i] = {};
                                for (let j = 0; j < items.length; j++) {
                                    packet.items[i][items[j]] = rooms[i][items[j]]; // insecure. need to filter accessible fields
                                }
                            }
                        }
                    }
                }
                next(packet);
            })
        }
    }
}