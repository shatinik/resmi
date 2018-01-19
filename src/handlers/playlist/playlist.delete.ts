import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import log from '../../logger'
import Packet from '../../packet';
import Playlist from '../../models/mysql/Playlist';

export class PlaylistDelete extends Handler {
    public deleteById(req: Request, res: Response, next: NextFunction, packet: Packet<any>): void {
        let id: number = NaN;

        if (!req.query.id) {
            packet.error = 'Not enough data';
        } else {
            id = req.query.id;
            if (isNaN(id)) {
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
                    let playlist = await playlistRepository.findOneById(id);
                    if (!playlist) {
                        packet.error = `No playlist with ID ${id}`;
                    } else {
                        if (playlist.delete_ban) {
                            packet.error = `This playlist isn't removable`;
                        } else {
                            await playlistRepository.remove(playlist);
                        }
                    }
                }
                next(packet);
            })
        }
    }
}