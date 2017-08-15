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
    public getAllByRoomId(req, res: Response, next: NextFunction): void {}
}