import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import Room from '../../models/mysql/Room';
import log from '../../logger'
import Packet from '../../packet';

export class RoomDelete extends Handler {
    public deleteById(req: Request, res: Response, next: NextFunction): void {
        connect.then(async connection => {
            let packet = new Packet('room', 'deleteById');
            if (req.query.id) {
                let id: number = Number(req.query.id);
                if (!isNaN(id)) {
                    if (connection instanceof Connection && connection.isConnected) {
                        let roomRepository = connection.getRepository(Room);
                        let room = await roomRepository.findOneById(id);
                        if (!room) {
                            packet.error = `No room with ID ${id}`;
                        }
                        await roomRepository.remove(room);
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
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.json(packet);
            next();
        })
    }

    public deleteAllByCreatorId(req: Request, res: Response, next: NextFunction): void {
        connect.then(async connection => {
            let packet = new Packet('room', 'deleteAllByCreatorId');
            if (req.query.creator_id) {
                let creator_id: number = Number(req.query.creator_id);
                if (!isNaN(creator_id)) {
                    if (connection instanceof Connection && connection.isConnected) {
                        let roomRepository = connection.getRepository(Room);
                        let data = await roomRepository.find({creator_id: creator_id});
                        if (!data || data.length == 0) {
                            packet.error = `No rooms with creator_id ${creator_id}`;
                        }
                        await roomRepository.remove(data);
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