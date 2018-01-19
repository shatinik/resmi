import Handler from '../../core/handler';
import connect from '../../core/mysql'
import log from '../../core/logger'
import Packet from '../../core/packet';
import Video from '../../models/mysql/Video';
import Playlist from '../../models/mysql/Playlist';

export class VideoGet extends Handler {
    getInfoById(req, res, next, packet) {
        /*
            Берётся информация о комнате
            api.site.com/v1/video/getInfoById?id=1&items=title,picture_uri,creator,current_video ...
        */
        let id = NaN;
        let items = [];

        if (!req.query.id || !req.query.items) {
            packet.error = 'Not enough data';
        } else {
            id = Number(req.query.id);
            items = req.query.items.split(',');
            if (isNaN(id)) {
                packet.error = 'ID is NaN';
            }
        }
        if (!packet.error) {
            connect.then(async connection => {
                if (!connection || !connection.isConnected) {
                    log.error('typeorm', 'DBConnection error');
                    packet.error = 'Internal error';
                } else {
                    let videoRepository = connection.getRepository(Video);
                    let data = await videoRepository.findOneById(id);
                    if (!data) {
                        packet.error = `No video with ID ${id}`;
                    } else {
                        packet.first = {};
                        for (let i = 0; i < items.length; i++) {
                            packet.first[items[i]] = data[items[i]]; // insecure. need to filter accessible fields
                        }
                    }
                }
                next(packet);
            })
        } else {
            next(packet);
        }
    }

     getAllByPlaylistId(req, res, next, packet) {
        /*
            Возвращается список всех комнат по id создателя
            api.site.com/v1/room/getAllByCreatorId?creator=1&items=title,picture_uri,author,current_video ...
        */
        let playlist_id = NaN;
        let items = [];

        if (!req.query.playlist || !req.query.items) {
            packet.error = 'Not enough data';
        } else {
            playlist_id = Number(req.query.room);
            items = req.query.items.split(',');
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
                    if (!playlist) {
                        packet.error = `No playlist with ID ${playlist_id}`;
                    } else {
                        let videoRepository = connection.getRepository(Video);
                        let videos = await videoRepository.find({playlistId: playlist.id});
                        if (videos.length == 0) {
                            packet.error = `No video in playlist ${playlist.id}`;
                        } else {
                            packet.items = [];
                            for (let i = 0; i < videos.length; i++) {
                                packet.items[i] = {};
                                for (let j = 0; j < items.length; j++) {
                                    packet.items[i][items[j]] = videos[i][items[j]]; // insecure. need to filter accessible fields
                                }
                            }
                        }
                    }
                }
                next(packet);
            })
        }
    }
}