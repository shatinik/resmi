import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import Room from '../../models/mysql/Room';
import log from '../../logger'
import Packet from '../../packet';
import User from '../../models/mysql/User'
import Word from '../../word'
import {authorized_only} from '../../decorators';

export class RoomPost extends Handler {

    @authorized_only()
    public addNew(req, res: Response, next: NextFunction, packet: Packet<any>): void {
        let user: User = req.user;
        let title: string = '';
        let picture_uri: string = '';
        let global_uri: string = Word.generate()+Math.round(Math.random()*1000);

        if (!req.body.title) { // || !req.body.picture_uri) {
            packet.error = 'Not enough data';
        } else {
            title = req.body.title;
            picture_uri = req.body.picture_uri;
        }

        if (packet.error) {
            next(packet);
        } else {
            connect.then(async connection => {
                if (!connection || connection instanceof Connection && !connection.isConnected) {
                    log.error('typeorm', 'DBConnection error');
                    packet.error = 'Internal error';
                } else {
                    let roomRepository = connection.getRepository(Room);
                    let room: Room = new Room();
                    room.title = title;
                    room.views = 0;
                    room.picture_uri = picture_uri;
                    room.global_uri = global_uri; // WTF?
                    room.creator = user;
                    await roomRepository.save(room);
                    packet.first = 'Ok';
                }
                next(packet);
            })
        }
    }
}