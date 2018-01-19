import Handler from '../../core/handler';
import connect from '../../core/mysql'
import Video from '../../models/mysql/Video';
import log from '../../core/logger'
import Packet from '../../core/packet';

export class VideoPut extends Handler {
    editById(req, res, next, packet) {
        /*
            Обновление информации о комнате по её Id
        */
        let id = NaN;
        let link = '';
        let service = '';
        let preview_picture_uri = '';

        if (!req.query.id || !req.query.link || !req.query.preview_picture_uri || !req.query.playlist) {
            packet.error = 'Not enough data';
        } else {
            id = Number(req.query.playlist);
            link = req.query.link;
            service = req.query.service;
            preview_picture_uri = req.query.preview_picture_uri;
            if (isNaN(id)) {
                packet.error = 'ID is NaN';
            }
        }

        if (packet.error) {
            next(packet)
        } else {
            connect.then(async connection => {
                if (!connection || !connection.isConnected) {
                    log.error('typeorm', 'DBConnection error');
                    packet.error = 'Internal error';
                } else {
                    let videoRepository = connection.getRepository(Video);
                    let video = await videoRepository.findOneById(id);
                    if (!video) {
                        packet.error = `No video with id ${id}`;
                    } else {
                        video.link = link || video.link;
                        video.service = service || video.service;
                        video.preview_picture_uri = preview_picture_uri || video.preview_picture_uri;
                        await videoRepository.save(video);
                        packet.first = 'Ok';
                    }
                }
                next(packet);
            })
        }
    }
}