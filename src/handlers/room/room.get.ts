import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import Room from '../../models/mysql/Room';
import log from '../../logger'
import Packet from '../../packet';
import User from '../../models/mysql/User';

export class RoomGet extends Handler {

    public isRoomExist(req: Request, res: Response, next: NextFunction, packet: Packet): void {
        /*
            Существует ли комната
            api.site.com/v1/room/isRoomExist?id=1
        */
        connect.then(async connection => {
            if (!req.query.id) {
                packet.error = 'Not enough data';
            }
            let id: number = Number(req.query.id);
            if (isNaN(id)) {
                packet.error = 'ID is NaN';
            }
            if (!packet.error) {
                if (!connection || connection instanceof Connection && !connection.isConnected) {
                    log.error('typeorm', 'DBConnection error');
                    packet.error = 'Internal error';
                } else {
                    let roomRepository = connection.getRepository(Room);
                    let data = await roomRepository.findOneById(id);
                    packet.first = !!data;
                }
            }
            next(packet);
        });
    }
    
    public getInfoById(req: Request, res: Response, next: NextFunction, packet: Packet): void {
        /*
            Берётся информация о комнате
            api.site.com/v1/room/getInfoById?id=1&items=title,picture_uri,creator,current_video ...
        */
        connect.then(async connection => {
            if (!req.query.id && !req.query.items) {
                packet.error = 'Not enough data';
            }
            let id: number = Number(req.query.id);
            let items: string[] = req.query.items.split(',');
            if (isNaN(id)) {
                packet.error = 'ID is NaN';
            }
            if (!packet.error) {
                if (!connection || connection instanceof Connection && !connection.isConnected) {
                    log.error('typeorm', 'DBConnection error');
                    packet.error = 'Internal error';
                } else {
                    let roomRepository = connection.getRepository(Room);
                    let data = await roomRepository.findOneById(id);
                    if (!data) {
                        packet.error = `No room with ID ${id}`;
                        packet.status = 204;
                    } else {
                        packet.first = {};
                        for (let i = 0; i < items.length; i++) {
                            packet.first[items[i]] = data[items[i]]; // insecure. need to filter accessible fields
                        }
                    }
                }
            }
            next(packet);
        });
    }

    public getAllByCreatorId(req: Request, res: Response, next: NextFunction, packet: Packet): void {
        /*
            Возвращается список всех комнат по id создателя
            api.site.com/v1/room/getAllByCreatorId?creator=1&items=title,picture_uri,author,current_video ...
        */
        connect.then(async connection => {
            if (req.query.creator && req.query.items) {
                packet.error = 'Not enough data';
            }
            let creator_id: number = Number(req.query.creator);
            let items: string[] = req.query.items.split(',');
            if (isNaN(creator_id)) {
                packet.error = 'ID is NaN';
            }
            if (!packet.error) {
                if (!connection || connection instanceof Connection && !connection.isConnected) {
                    log.error('typeorm', 'DBConnection error');
                    packet.error = 'Internal error';
                } else {
                    let userRepository = connection.getRepository(User);
                    let creator: User = await userRepository.findOneById(creator_id);
                    if (creator) {
                        let roomRepository = connection.getRepository(Room);
                        let data = await roomRepository.find({creator: creator});
                        if (!data || data.length == 0) {
                            packet.error = `No rooms with creatorId ${creator_id}`;
                        }
                        packet.items = [];
                        for (let i = 0; i < data.length; i++) {
                            packet.items[i] = {};
                            for (let j = 0; j < items.length; j++) {
                                packet.items[i][items[j]] = data[i][items[j]]; // insecure. need to filter accessible fields
                            }
                        }
                    }
                }
            }
            next(packet);
        })
    }
}