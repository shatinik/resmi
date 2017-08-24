import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import Room from '../../models/mysql/Room';
import log from '../../logger'
import Packet from '../../packet';
import User from '../../models/mysql/User';

export class RoomDelete extends Handler {
    public deleteById(req: Request, res: Response, next: NextFunction, packet: Packet): void {
        let id: number = NaN;

        if (!req.query.id) {
            packet.error = 'Not enough data';
        } else {
            id = Number(req.query.id);
            if (isNaN(id)) {
                packet.error = 'ID is NaN';
            }
        }

        if (!packet.error) {
            connect.then(async connection => {
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
                next(packet);
            })
        } else {
            next(packet);
        }
    }

    public deleteAllByCreatorId(req: Request, res: Response, next: NextFunction, packet: Packet): void {
        let creator_id: number = NaN;

        if (!req.query.creator_id) {
            packet.error = 'Not enough data';
        } else {
            creator_id = Number(req.query.creator);
            if (isNaN(creator_id)) {
                packet.error = 'ID is NaN';
            }
        }

        if (!packet.error) {
            connect.then(async connection => {
                if (connection instanceof Connection && connection.isConnected) {
                    let userRepository = connection.getRepository(User);
                    let creator: User = await userRepository.findOneById(creator_id);
                    if (creator) {
                        let roomRepository = connection.getRepository(Room);
                        let data = await roomRepository.find({creator: creator});
                        if (!data || data.length == 0) {
                            packet.error = `No rooms with creator_id ${creator_id}`;
                        } else {
                            await roomRepository.remove(data);
                        }
                    }
                } else {
                    log.error('typeorm', 'DBConnection error');
                    packet.error = 'Internal error';
                }
                next(packet);
            })
        } else {
            next(packet);
        }
    }
}