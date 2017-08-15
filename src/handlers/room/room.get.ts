import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import Room from '../../models/mysql/Room';
import log from '../../logger'
import Packet from '../../packet';

export class RoomGet extends Handler {

    public isRoomExist(req: Request, res: Response, next: NextFunction): void {
        /*
            Существует ли комната
            api.site.com/v1/room/isRoomExist?id=1
        */
        connect.then(async connection => {
            let packet = new Packet('room', 'isRoomExist');
            if (req.query.id) {
                let id: number = Number(req.query.id);
                if (!isNaN(id)) {
                    if (connection instanceof Connection && connection.isConnected) {
                        let roomRepository = connection.getRepository(Room);
                        let data = await roomRepository.findOneById(id);
                        packet.first = !!data;
                    } else {
                        log.error('typeorm', 'DBConnection error');
                        packet.error = 'Internal error';
                    }
                } else {
                    packet.error = 'ID is NaN';
                }
            } else {
                packet.error = 'Not enough data';
            }
            if (packet.error) {
                log.debug('net', packet.error);
            }
            res.json(packet);
            next();
        })
    }
    
    public getInfoById(req: Request, res: Response, next: NextFunction): void {
        /*
            Берётся информация о комнате
            api.site.com/v1/room/getInfoById?id=1&items=title,picture_uri,creator_id,current_video ...
        */
        connect.then(async connection => {
            let packet = new Packet('room', 'getInfoById');
            if (req.query.id && req.query.items) {
                let id: number = Number(req.query.id);
                let items: string[] = req.query.items.split(',');
                if (!isNaN(id)) {
                    if (connection instanceof Connection && connection.isConnected) {
                        let roomRepository = connection.getRepository(Room);
                        let data = await roomRepository.findOneById(id);
                        if (!data) {
                            packet.first = `No room with ID ${id}`;
                        }
                        packet.first = {};
                        for (let i = 0; i < items.length; i++) {
                            packet.first[items[i]] = data[items[i]]; // insecure. need to filter accessible fields
                        }
                    } else {
                        log.error('typeorm', 'DBConnection error');
                        packet.error = 'Internal error';
                    }
                } else {
                    packet.error = 'ID is NaN';
                }
            } else {
                packet.error = 'Not enough data';
            }
            if (packet.error) {
                log.debug('net', packet.error);
            }
            res.json(packet);
            next();
        })
    }

    public getAllByCreatorId(req: Request, res: Response, next: NextFunction): void {
        /*
            Возвращается список всех комнат по id создателя
            api.site.com/v1/room/getAllByCreatorId?creator_id=1&items=title,picture_uri,author,current_video ...
        */
        connect.then(async connection => {
            let packet = new Packet('room', 'getAllByCreatorId');
            if (req.query.creator_id && req.query.items) {
                let creator_id: number = Number(req.query.creator_id);
                let items: string[] = req.query.items.split(',');
                if (!isNaN(creator_id)) {
                    if (connection instanceof Connection && connection.isConnected) {
                        let roomRepository = connection.getRepository(Room);
                        let data = await roomRepository.find({creator_id: creator_id});
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

                    } else {
                        log.error('typeorm', 'DBConnection error');
                        packet.error = 'Internal error';
                    }
                } else {
                    packet.error = 'ID is NaN';
                }
            } else {
                packet.error = 'Not enough data';
            }
            if (packet.error) {
                log.debug('net', packet.error);
            }
            res.json(packet);
            next();
        })
    }

}