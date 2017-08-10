import { Handler } from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import { Room } from '../../models/Room';
import log from '../../logger'
import Packet from '../../packet';

export class RoomGet extends Handler {

    public isRoomExist(req: Request, res: Response, next: NextFunction): void {
        /*
            Существует ли комната
            api.site.com/v1/room/isRoomExist?id=1
        */
    }
    
    public getById(req: Request, res: Response, next: NextFunction): void {
        /*
            Берётся информация о комнате
            api.site.com/v1/room/getInfoById?id=1&items=title,photo,author,currentVideo ...
        */
        console.log(1);
        connect.then(async connection => {
            let packet = new Packet('room', 'getInfo');
            if (req.query.id) {
                let id: number = Number(req.query.id);
                if (!isNaN(id)) {
                    if (connection instanceof Connection && connection.isConnected) {
                        let roomRepository = connection.getRepository(Room);
                        packet.first = await roomRepository.findOneById(id);
                        if (!packet.first) {
                            packet.error = `No room with ID ${id}`;
                        }
                    } else {
                        log.error('typeorm', 'DBConnection error');
                        packet.error = 'Internal error';
                    }
                } else {
                    packet.error = 'ID is NaN';
                }
            } else {
                packet.error = 'ID is empty';
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
            api.site.com/v1/room/getAllByCreatorId?creator_id=1&items=title,photo,author,currentVideo ...
        */
    }

}