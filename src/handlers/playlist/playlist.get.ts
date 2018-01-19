import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import Playlist from '../../models/mysql/Playlist';
import log from '../../logger'
import Packet from '../../packet';
import Room from '../../models/mysql/Room';

export class PlaylistGet extends Handler {
    public getInfoById(req: Request, res: Response, next: NextFunction, packet: Packet<any>): void {
        /*
            Берётся информация о комнате
            api.site.com/v1/playlist/getInfoById?id=1&items=title,picture_uri,creator,current_video ...
        */
        let id: number = NaN;
        let items: string[] = [];

        if (!req.query.id || !req.query.items) {
            packet.error = 'Not enough data';
        } else {
            id = req.query.id;
            items = req.query.items;
            if (isNaN(id)) {
                packet.error = 'ID is NaN';
            }
        }

        if (!packet.error) {
            connect.then(async connection => {
                if (!connection || connection instanceof Connection && !connection.isConnected) {
                    log.error('typeorm', 'DBConnection error');
                    packet.error = 'Internal error';
                } else {
                    let playlistRepository = connection.getRepository(Playlist);
                    let data = await playlistRepository.findOneById(id);
                    if (!data) {
                        packet.error = `No playlist with ID ${id}`;
                    } else {
                        packet.first = {};
                        for (let i = 0; i < items.length; i++) {
                            packet.first[items[i]] = data[items[i]]; // insecure. need to filter accessible fields
                        }
                    }
                }
                next(packet);
            })
        } else {
            next(packet);
        }
    }

    public getAllByRoomId(req: Request, res: Response, next: NextFunction, packet: Packet<any>): void {
        /*
            Возвращается список всех комнат по id создателя
            api.site.com/v1/room/getAllByCreatorId?creator=1&items=title,picture_uri,author,current_video ...
        */
        let room_id: number = NaN;
        let items: string[] = [];

        if (!req.query.creator || !req.query.items) {
            packet.error = 'Not enough data';
        } else {
            room_id = Number(req.query.room);
            items = req.query.items.split(',');
            if (isNaN(room_id)) {
                packet.error = 'ID is NaN';
            }
        }

        if (packet.error) {
            next(packet);
        } else {
            connect.then(async connection => {
                if (!connection || connection instanceof Connection && !connection.isConnected) {
                    log.error('typeorm', 'DBConnection error');
                    packet.error = 'Internal error';
                } else {
                    let userRepository = connection.getRepository(Room);
                    let room: Room = await userRepository.findOneById(room_id);
                    if (!room) {
                        packet.error = `No room with ID ${room_id}`;
                    } else {
                        let playlistRepository = connection.getRepository(Playlist);
                        let playlists: Playlist[] = await playlistRepository.find({roomId: room.id});
                        if (playlists.length == 0) {
                            packet.error = `No playlist in room ${room_id}`;
                        } else {
                            packet.items = [];
                            for (let i = 0; i < playlists.length; i++) {
                                packet.items[i] = {};
                                for (let j = 0; j < items.length; j++) {
                                    packet.items[i][items[j]] = playlists[i][items[j]]; // insecure. need to filter accessible fields
                                }
                            }
                        }
                    }
                }
                next(packet);
            })
        }
    }
}