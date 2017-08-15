import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import Room from '../../models/mysql/Room';
import log from '../../logger'
import Packet from '../../packet';
import User from '../../models/mysql/User';
import Playlist from '../../models/mysql/Playlist';

export class PlaylistDelete extends Handler {
    public deleteById(req: Request, res: Response, next: NextFunction): void {
        connect.then(async connection => {
            let packet = new Packet('playlist', 'deleteById');
            if (req.query.id) {
                let id: number = Number(req.query.id);
                if (!isNaN(id)) {
                    if (connection instanceof Connection && connection.isConnected) {
                        let playlistRepository = connection.getRepository(Playlist);
                        let playlist = await playlistRepository.findOneById(id);
                        if (!playlist) {
                            packet.error = `No room with ID ${id}`;
                        }
                        if (!playlist.delete_ban) {
                            await playlistRepository.remove(playlist);
                        } else {
                            packet.error = `This playlist isn't removable`;
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
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.json(packet);
            next();
        })
    }
}