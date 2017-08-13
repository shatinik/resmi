import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import Room from '../../models/mysql/Room';
import log from '../../logger'
import Packet from '../../packet';

export class RoomPut extends Handler {

    public editById(req: Request, res: Response, next: NextFunction): void {
        /*
            Обновление информации о комнате по её Id
        */
        connect.then(async connection => {
            let packet = new Packet('room', 'editById');
            if (req.query.id) {
                let id: number = Number(req.query.id);
                let title: string = req.query.title || undefined;
                let urlAdress: string = req.query.urlAdress || undefined;
                let photo: string = req.query.photo || undefined;
                if (!isNaN(id)) {
                    if (connection instanceof Connection && connection.isConnected) {
                        let roomRepository = connection.getRepository(Room);
                        let room = await roomRepository.findOneById(id);
                        room.title = title;
                        room.urlAdress = urlAdress;
                        room.photo = photo;
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