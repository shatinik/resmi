import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import Video from '../../models/mysql/Video';
import log from '../../logger'
import Packet from '../../packet';

export class VideoPut extends Handler {
    public editById(req: Request, res: Response, next: NextFunction): void {
        /*
            Обновление информации о комнате по её Id
        */
        connect.then(async connection => {
            let packet = new Packet('video', 'editById');
            if (req.query.id) {
                let id: number = Number(req.query.id);
                let link: string = req.query.link;
                let service: string = req.query.service;
                let preview_picture_uri: string = req.query.preview_picture_uri;
                if (!isNaN(id)) {
                    if (connection instanceof Connection && connection.isConnected) {
                        let videoRepository = connection.getRepository(Video);
                        let video = await videoRepository.findOneById(id);
                        if (video) {
                            video.link = link || video.link;
                            video.service = service || video.service;
                            video.preview_picture_uri = preview_picture_uri || video.preview_picture_uri;
                            videoRepository.save(video).then(room => {
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