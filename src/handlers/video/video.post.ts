import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import Playlist from '../../models/mysql/Playlist';
import log from '../../logger'
import Packet from '../../packet';
import Video from '../../models/mysql/Video'

export class VideoPost extends Handler {
    public addNew(req, res: Response, next: NextFunction): void {
        let packet = new Packet('video', 'addNew');
        connect.then(async connection => {
            if (req.query.link && req.query.preview_picture_uri && req.query.playlist && req.query.playlist) {
                let link: string = req.query.link;
                let service: string = req.query.service;
                let preview_picture_uri: string = req.query.preview_picture_uri;
                let playlist_id: number = req.query.playlist;
                if (link && preview_picture_uri) {
                    if (connection instanceof Connection && connection.isConnected) {
                        let playlistRepository = connection.getRepository(Playlist);
                        let playlist: Playlist = await playlistRepository.findOneById(playlist_id);
                        if (playlist) {
                            let roomRepository = connection.getRepository(Video);
                            let video: Video = new Video();
                            video.link = link;
                            video.service = service;
                            video.playlist = playlist;
                            video.preview_picture_uri = preview_picture_uri;
                            roomRepository.save(video).then(room => {
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