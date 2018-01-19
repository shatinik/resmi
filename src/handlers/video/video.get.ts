import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import log from '../../logger'
import Packet from '../../packet';
import Video from '../../models/mysql/Video';
import Playlist from '../../models/mysql/Playlist';

export class VideoGet extends Handler {
    public getInfoById(req: Request, res: Response, next: NextFunction, packet: Packet<any>): void {
        /*
            Берётся информация о комнате
            api.site.com/v1/video/getInfoById?id=1&items=title,picture_uri,creator,current_video ...
        */
        let id: number = NaN;
        let items: string[] = [];

        if (!req.query.id || !req.query.items) {
            packet.error = 'Not enough data';
        } else {
            id = Number(req.query.id);
            items = req.query.items.split(',');
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
                    let videoRepository = connection.getRepository(Video);
                    let data = await videoRepository.findOneById(id);
                    if (!data) {
                        packet.error = `No video with ID ${id}`;
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

    public getAllByPlaylistId(req: Request, res: Response, next: NextFunction, packet: Packet<any>): void {
        /*
            Возвращается список всех комнат по id создателя
            api.site.com/v1/room/getAllByCreatorId?creator=1&items=title,picture_uri,author,current_video ...
        */
        let playlist_id: number = NaN;
        let items: string[] = [];

        if (!req.query.playlist || !req.query.items) {
            packet.error = 'Not enough data';
        } else {
            playlist_id = Number(req.query.room);
            items = req.query.items.split(',');
            if (isNaN(playlist_id)) {
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
                    let playlistRepository = connection.getRepository(Playlist);
                    let playlist: Playlist = await playlistRepository.findOneById(playlist_id);
                    if (!playlist) {
                        packet.error = `No playlist with ID ${playlist_id}`;
                    } else {
                        let videoRepository = connection.getRepository(Video);
                        let videos: Video[] = await videoRepository.find({playlistId: playlist.id});
                        if (videos.length == 0) {
                            packet.error = `No video in playlist ${playlist.id}`;
                        } else {
                            packet.items = [];
                            for (let i = 0; i < videos.length; i++) {
                                packet.items[i] = {};
                                for (let j = 0; j < items.length; j++) {
                                    packet.items[i][items[j]] = videos[i][items[j]]; // insecure. need to filter accessible fields
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