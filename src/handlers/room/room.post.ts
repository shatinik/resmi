import { Handler } from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import { Room } from '../../models/mysql/Room';
import log from '../../logger'
import Packet from '../../packet';

export class RoomPost extends Handler {

    public addNew(req, res: Response, next: NextFunction): void {
        let packet = new Packet('room', 'getInfo');
        if (!req.user) {
            log.fatal('system', 'ATTENTION! Authenticate before calling room::add. Remove this message after enabling RBAC');
            packet.error = 'Not logged in';
            res.json(packet);
            next();
            return
        }
        connect.then(async connection => {
            if (req.query.title && req.query.urlAdress) {
                let title: string = req.query.title;
                let urlAdress: string = req.query.urlAdress;
                if (title && urlAdress) {
                    if (connection instanceof Connection && connection.isConnected) {
                        let roomRepository = connection.getRepository(Room);
                        let room: Room = new Room();
                        room.title = title;
                        room.urlAdress = urlAdress;
                        room.creator_id = req.user[0].id;
                        roomRepository.save(room).then(room => {
                            packet.first = 'Ok';
                            res.json(packet);
                            next();
                        });
                        return;
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