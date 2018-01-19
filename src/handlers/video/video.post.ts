import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import Playlist from '../../models/mysql/Playlist';
import log from '../../logger'
import Packet from '../../packet';
import Video from '../../models/mysql/Video'

export class VideoPost extends Handler {
    public addNew(req, res: Response, next: NextFunction, packet: Packet<any>): void {
        let playlist_id: number = NaN;
        let link: string = '';
        let service: string = '';
        let preview_picture_uri: string = '';

        if (!req.query.playlist || !req.query.link || !req.query.service || !req.query.preview_picture_uri) {
            packet.error = 'Not enough data';
        } else {
            playlist_id = Number(req.query.playlist);
            link = req.query.link;
            service = req.query.service;
            preview_picture_uri = req.query.preview_picture_uri;
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
                    if (playlist) {
                        let roomRepository = connection.getRepository(Video);
                        let video: Video = new Video();
                        video.link = link || video.link;
                        video.service = service || video.service;
                        video.playlist = playlist || video.playlist;
                        video.preview_picture_uri = preview_picture_uri || video.preview_picture_uri;
                        await roomRepository.save(video);
                        packet.first = 'Ok';
                    }
                }
                next(packet);
            })
        }
    }
}