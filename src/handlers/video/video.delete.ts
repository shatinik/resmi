import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import log from '../../logger'
import Packet from '../../packet';
import Video from '../../models/mysql/Video';

export class VideoDelete extends Handler {
    public deleteById(req: Request, res: Response, next: NextFunction): void {
        connect.then(async connection => {
            let packet = new Packet('video', 'deleteById');
            if (req.query.id) {
                let id: number = Number(req.query.id);
                if (!isNaN(id)) {
                    if (connection instanceof Connection && connection.isConnected) {
                        let videoRepository = connection.getRepository(Video);
                        let video = await videoRepository.findOneById(id);
                        if (!video) {
                            packet.error = `No video with ID ${id}`;
                        }
                        await videoRepository.remove(video);
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