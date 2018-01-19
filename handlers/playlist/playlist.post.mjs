import Handler from '../../core/handler';
import connect from '../../core/mysql'
import Room from '../../models/mysql/Room';
import log from '../../core/logger'
import Packet from '../../core/packet';
import Playlist from '../../models/mysql/Playlist'

export class PlaylistPost extends Handler {
    addNew(req, res, next, packet) {
        let room_id = NaN;
        let title = '';
        let preview_picture_url = '';

        if (!req.query.title || !req.query.preview_picture_url || !req.query.room) {
            packet.error = 'Not enough data';
        } else {
            room_id = req.query.room;
            title = req.query.title;
            preview_picture_url = req.query.preview_picture_url;
            if (isNaN(room_id)) {
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
                    let userRepository = connection.getRepository(Room);
                    let room = await userRepository.findOneById(room_id);
                    if (!room) {
                        packet.error = `No room with ID ${room_id}`;
                    } else {
                        let roomRepository = connection.getRepository(Playlist);
                        let playlist = new Playlist();
                        playlist.title = title;
                        playlist.delete_ban = false;
                        playlist.preview_picture_url = preview_picture_url;
                        playlist.room = room; // WTF?
                        await roomRepository.save(playlist);
                        packet.first = 'Ok';
                    }
                }
                next(packet);
            })
        }
    }
}