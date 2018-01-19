import Handler from '../../core/handler';
import connect from '../../core/mysql'
import log from '../../core/logger'
import Packet from '../../core/packet';
import Video from '../../models/mysql/Video';

export class VideoDelete extends Handler {
    deleteById(req, res, next, packet) {
        let id = NaN;

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
                if (!connection || !connection.isConnected) {
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