import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import Playlist from '../../models/mysql/Playlist';
import log from '../../logger'
import Packet from '../../packet';

export class PlaylistPut extends Handler {

    public editById(req: Request, res: Response, next: NextFunction, packet: Packet): void {
        /*
            Обновление информации о комнате по её Id
        */
        let id: number = NaN;
        let title: string = '';
        let preview_picture_url: string = '';

        if (!req.query.id) {
            packet.error = 'Not enough data';
        } else {
            id = Number(req.query.id);
            title = req.query.title;
            preview_picture_url = req.query.preview_picture_url;
            if (isNaN(id)) {
                packet.error = 'ID is NaN';
            }
        }

        if (packet.error) {
            next(packet)
        } else {
            connect.then(async connection => {
                if (!connection || connection instanceof Connection && !connection.isConnected) {
                    log.error('typeorm', 'DBConnection error');
                    packet.error = 'Internal error';
                } else {
                    let playlistRepository = connection.getRepository(Playlist);
                    let playlist = await playlistRepository.findOneById(id);
                    if (!playlist) {
                        packet.error = `No playlist with ID ${id}`;
                    } else {
                        playlist.title = title || playlist.title;
                        playlist.preview_picture_url = preview_picture_url || playlist.preview_picture_url;
                        await playlistRepository.save(playlist);
                        packet.first = 'Ok';
                    }
                }
                next(packet);
            })
        }
    }
}