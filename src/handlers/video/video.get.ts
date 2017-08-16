import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import log from '../../logger'
import Packet from '../../packet';
import Video from '../../models/mysql/Video';
import Playlist from '../../models/mysql/Playlist';

export class VideoGet extends Handler {
    public getInfoById(req: Request, res: Response, next: NextFunction): void {
        /*
            Берётся информация о комнате
            api.site.com/v1/video/getInfoById?id=1&items=title,picture_uri,creator,current_video ...
        */
        connect.then(async connection => {
            let packet = new Packet('video', 'getInfoById');
            if (req.query.id && req.query.items) {
                let id: number = Number(req.query.id);
                let items: string[] = req.query.items.split(',');
                if (!isNaN(id)) {
                    if (connection instanceof Connection && connection.isConnected) {
                        let videoRepository = connection.getRepository(Video);
                        let data = await videoRepository.findOneById(id);
                        if (!data) {
                            packet.first = `No video with ID ${id}`;
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
    public getAllByPlaylistId(req: Request, res: Response, next: NextFunction): void {
        /*
            Возвращается список всех комнат по id создателя
            api.site.com/v1/room/getAllByCreatorId?creator=1&items=title,picture_uri,author,current_video ...
        */
        connect.then(async connection => {
            let packet = new Packet('video', 'getAllByPlaylistId');
            if (req.query.playlist && req.query.items) {
                let playlist_id: number = Number(req.query.playlist);
                let items: string[] = req.query.items.split(',');
                if (!isNaN(playlist_id)) {
                    if (connection instanceof Connection && connection.isConnected) {
                        let playlistRepository = connection.getRepository(Playlist);
                        let playlist: Playlist = await playlistRepository.findOneById(playlist_id);
                        if (playlist) {
                            let videoRepository = connection.getRepository(Video);
                            let data = await videoRepository.find({playlist: playlist});
                            if (!data || data.length == 0) {
                                packet.error = `No video in playlist ${playlist_id}`;
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