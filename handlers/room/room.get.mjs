import Handler from '../../core/handler';
import Room from '../../models/mongo/Room';
import log from '../../core/logger'
import Packet from '../../core/packet';
import User from '../../models/mongo/User';
import mongoose from 'mongoose';

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

    async getAllByCreatorId(req, res, next, packet) {
        /*
            Возвращается список всех комнат по id создателя
            api.site.com/v1/room/getAllByCreatorId?creator=1&items=title,picture_uri,author,current_video ...
        */

        if (!req.query.creator || !req.query.items) {
            packet.error = 'Not enough data';
        }
        else if (!mongoose.Types.ObjectId.isValid(req.query.creator)) {
            packet.error = 'CreatorID is not valid';
        } else {
            let creator_id = req.query.creator;
            let items = req.query.items.split(',');
            let creator = await User.findOne({ _id: creator_id }).populate('Room').exec();
            packet.items = [];
            if (!creator) {
                packet.error = `User ${creator_id} not found`;
            }
            else if (!creator.rooms) {
                packet.error = `There are no rooms of user ${creator_id}`;
            } else {
                for (let i = 0; i < creator.rooms.length; i++) {
                    packet.items[i] = {};
                    for (let j = 0; j < items.length; j++) {
                        packet.items[i][items[j]] = creator.rooms[i][items[j]]; // insecure. need to filter accessible fields
                    }
                }
            }
        }
        next(packet);
    }
}