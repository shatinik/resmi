import Handler from '../../core/handler';
import connect from '../../core/mysql'
import Playlist from '../../models/mysql/Playlist';
import log from '../../core/logger'
import Packet from '../../core/packet';

export class PlaylistPut extends Handler {

    editById(req, res, next, packet) {
        /*
            Обновление информации о комнате по её Id
        */
        let id = NaN;
        let title = '';
        let preview_picture_url = '';

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
                if (!connection || !connection.isConnected) {
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