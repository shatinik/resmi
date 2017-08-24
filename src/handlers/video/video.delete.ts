import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import log from '../../logger'
import Packet from '../../packet';
import Video from '../../models/mysql/Video';

export class VideoDelete extends Handler {
    public deleteById(req: Request, res: Response, next: NextFunction, packet: Packet): void {
        let id: number = NaN;

        if (!req.query.id) {
            packet.error = 'Not enough data';
        } else {
            id = Number(req.query.id);
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
                    let videoRepository = connection.getRepository(Video);
                    let video = await videoRepository.findOneById(id);
                    if (!video) {
                        packet.error = `No video with ID ${id}`;
                    } else {
                        await videoRepository.remove(video);
                    }
                }
                next(packet);
            })
        }
    }
}