import Handler from '../../core/handler';
import Room from '../../models/mongo/Room';
import {model as Video} from '../../models/mongo/Video';
import log from '../../core/logger'
import Packet from '../../core/packet';
import User from '../../models/mongo/User';
import mongoose from 'mongoose';
import Word from '../../core/word'

const ObjectId = mongoose.Types.ObjectId;

export class RoomGet extends Handler {

    async isRoomExist(req, res, next, packet) {
        /*
            Существует ли комната
            api.site.com/v1/room/isRoomExist?id=1
        */
        let roomId = req.query.id;
        if (!roomId) {
            packet.error = 'Not enough data';
        } else if (!mongoose.Types.ObjectId.isValid(roomId)) {
            packet.error = 'roomId is not valid';
        }

        if (!packet.error) {
            let data = await Room.findOne({ _id: roomId });
            packet.first = !!data;
        }
        next(packet);
    }

    async list(req, res, next, packet) {
        /*
            Существует ли комната
            api.site.com/v1/room/list?id=1
        */

        let items = req.query.items;
        if (!items) {
            packet.error = `Not enough data`;
        } else {
            let rooms = await Room.find().limit(10).exec();
            if (!rooms) {
                packet.error = `No rooms in database`;
            } else {
                items = items.split(',');
                packet.items = [];
                for (let i = 0; i < rooms.length; i++) {
                    packet.items[i] = {};
                    for (let j = 0; j < items.length; j++) {
                        packet.items[i][items[j]] = rooms[i][items[j]]; // insecure. need to filter accessible fields
                    }
                }

            }
        }

        next(packet);
    }


    async getIdByName(req, res, next, packet) {
        /*
            Существует ли комната
            api.site.com/v1/room/isRoomExist?uniqName=1
        */
        let uniqName = req.query.uniqName;

        if (!uniqName) {
            packet.error = 'Not enough data';
        }

        if (!packet.error) {
            let room = await Room.findOne({ uniqName: uniqName });
            if (!room) {
                packet.error = `No room with uniqName ${uniqName}`;
            } else {
                packet.items = [{}];
                packet.first['_id'] = room['_id']; // insecure. need to filter accessible fields
            }
        }

        next(packet);
    }

    async getInfoByName(req, res, next, packet) {
        /*
            Берётся информация о комнате
            api.site.com/v1/room/getInfoById?id=1&items=title,picture_uri,creator,current_video ...
        */
        let uniqName = req.query.uniqName;
        let items = req.query.items;

        if (!uniqName || !items) {
            packet.error = 'Not enough data';
        } else {
            items = req.query.items.split(',');
        }

        if (!packet.error) {
            let room = await Room.findOne({ uniqName: uniqName }).populate('videoplayer.Video');
            if (!room) {
                packet.error = `No room with uniqName ${uniqName}`;
            } else {
                packet.first = {};
                for (let i = 0; i < items.length; i++) {
                    switch(items[i]) {
                        case '_id': {
                            if (req.user && req.user == room.creator) {
                                packet.first['_id'] = room._id;
                            }
                            break;
                        }
                        case 'videoplayer': {
                            room = await room.populate('videoplayer.Video');
                            packet.first['videoplayer'] = await room.videoplayer;
                        }
                        default: {
                            packet.first[items[i]] = room[items[i]];
                        }
                    }
                }
            }
        }
        next(packet);
    }

    async getInfoById(req, res, next, packet) {
        /*
            Берётся информация о комнате
            api.site.com/v1/room/getInfoById?id=1&items=title,picture_uri,creator,current_video ...
        */
        let roomId = req.query.id;
        let items = req.query.items;

        if (!roomId || !items) {
            packet.error = 'Not enough data';
        } else {
            items = req.query.items.split(',');
            if (!mongoose.Types.ObjectId.isValid(roomId)) {
                packet.error = 'roomId is not valid';
            }
        }

        if (!packet.error) {
            let room = await Room.findOne({ _id: roomId });
            if (!room) {
                packet.error = `No room with _id ${roomId}`;
            } else {
                packet.first = {};
                for (let i = 0; i < items.length; i++) {
                    packet.first[items[i]] = room[items[i]]; // insecure. need to filter accessible fields
                }
            }
        }
        next(packet);
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
            let creator = await User.findOne({ _id: creator_id }).populate('rooms').exec();
            if (!creator) {
                packet.error = `User ${creator_id} not found`;
            }
            else if (!creator.rooms) {
                packet.error = `There are no rooms of user ${creator_id}`;
            } else {
                packet.items = [];
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