import Handler from '../../core/handler';
import connect from '../../core/mysql'
import Playlist from '../../models/mysql/Playlist';
import log from '../../core/logger'
import Packet from '../../core/packet';
import Video from '../../models/mysql/Video'

export class VideoPost extends Handler {
    addNew(req, res, next, packet) {
        let playlist_id = NaN;
        let link = '';
        let service = '';
        let preview_picture_uri = '';

        if (!req.query.playlist || !req.query.link || !req.query.service || !req.query.preview_picture_uri) {
            packet.error = 'Not enough data';
        } else {
            playlist_id = Number(req.query.playlist);
            link = req.query.link;
            service = req.query.service;
            preview_picture_uri = req.query.preview_picture_uri;
            if (isNaN(playlist_id)) {
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
                    let playlistRepository = connection.getRepository(Playlist);
                    let playlist = await playlistRepository.findOneById(playlist_id);
                    if (playlist) {
                        let roomRepository = connection.getRepository(Video);
                        let video = new Video();
                        video.link = link || video.link;
                        video.service = service || video.service;
                        video.playlist = playlist || video.playlist;
                        video.preview_picture_uri = preview_picture_uri || video.preview_picture_uri;
                        await roomRepository.save(video);
                        packet.first = 'Ok';
                    }
                }
                next(packet);
            })
        }
    }
}