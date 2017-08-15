import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import Playlist from '../../models/mysql/Playlist';
import log from '../../logger'
import Packet from '../../packet';

export class PlaylistPut extends Handler {

    public editById(req: Request, res: Response, next: NextFunction): void {
        /*
            Обновление информации о комнате по её Id
        */
        connect.then(async connection => {
            let packet = new Packet('room', 'editById');
            if (req.query.id) {
                let id: number = Number(req.query.id);
                let title: string = req.query.title || undefined;
                let preview_picture_url: string = req.query.preview_picture_url;
                if (!isNaN(id)) {
                    if (connection instanceof Connection && connection.isConnected) {
                        let playlistRepository = connection.getRepository(Playlist);
                        let playlist = await playlistRepository.findOneById(id);
                        playlist.title = playlist.title || title;
                        playlist.preview_picture_url = playlist.preview_picture_url || preview_picture_url;
                        playlistRepository.save(playlist).then(room => {
                            packet.first = 'Ok';
                            res.json(packet);
                            next();
                        });
                        return;
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