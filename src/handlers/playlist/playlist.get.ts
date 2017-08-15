import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import Playlist from '../../models/mysql/Playlist';
import log from '../../logger'
import Packet from '../../packet';
import Room from '../../models/mysql/Room';

export class PlaylistGet extends Handler {
    public getInfoById(req: Request, res: Response, next: NextFunction): void {
        /*
            Берётся информация о комнате
            api.site.com/v1/playlist/getInfoById?id=1&items=title,picture_uri,creator,current_video ...
        */
        connect.then(async connection => {
            let packet = new Packet('playlist', 'getInfoById');
            if (req.query.id && req.query.items) {
                let id: number = Number(req.query.id);
                let items: string[] = req.query.items.split(',');
                if (!isNaN(id)) {
                    if (connection instanceof Connection && connection.isConnected) {
                        let playlistRepository = connection.getRepository(Playlist);
                        let data = await playlistRepository.findOneById(id);
                        if (!data) {
                            packet.first = `No playlist with ID ${id}`;
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

    public getAllByRoomId(req: Request, res: Response, next: NextFunction): void {
        /*
            Возвращается список всех комнат по id создателя
            api.site.com/v1/room/getAllByCreatorId?creator=1&items=title,picture_uri,author,current_video ...
        */
        connect.then(async connection => {
            let packet = new Packet('room', 'getAllByCreatorId');
            if (req.query.creator && req.query.items) {
                let room_id: number = Number(req.query.creator);
                let items: string[] = req.query.items.split(',');
                if (!isNaN(room_id)) {
                    if (connection instanceof Connection && connection.isConnected) {
                        let userRepository = connection.getRepository(Room);
                        let room: Room = await userRepository.findOneById(room_id);
                        if (room) {
                            let playlistRepository = connection.getRepository(Playlist);
                            let data = await playlistRepository.find({room: room});
                            if (!data || data.length == 0) {
                                packet.error = `No playlist in room ${room_id}`;
                            }
                            packet.items = [];
                            for (let i = 0; i < data.length; i++) {
                                packet.items[i] = {};
                                for (let j = 0; j < items.length; j++) {
                                    packet.items[i][items[j]] = data[i][items[j]]; // insecure. need to filter accessible fields
                                }
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