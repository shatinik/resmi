import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import Room from '../../models/mysql/Room';
import log from '../../logger'
import Packet from '../../packet';
import Playlist from '../../models/mysql/Playlist'

export class PlaylistPost extends Handler {
    public addNew(req, res: Response, next: NextFunction): void {
        let packet = new Packet('playlist', 'addNew');
        connect.then(async connection => {
            if (req.query.title && req.query.preview_picture_url && req.query.room) {
                let title: string = req.query.title;
                let preview_picture_url: string = req.query.preview_picture_url;
                let room_id: number = req.query.room;
                if (title && preview_picture_url) {
                    if (connection instanceof Connection && connection.isConnected) {
                        let userRepository = connection.getRepository(Room);
                        let room: Room = await userRepository.findOneById(room_id);
                        if (room) {
                            let roomRepository = connection.getRepository(Playlist);
                            let playlist: Playlist = new Playlist();
                            playlist.title = title;
                            playlist.delete_ban = false;
                            playlist.preview_picture_url = preview_picture_url;
                            playlist.room = room; // WTF?
                            roomRepository.save(playlist).then(room => {
                                packet.first = 'Ok';
                                res.json(packet);
                                next();
                            });
                            return;
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