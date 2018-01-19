import Handler from '../../core/handler';
import connect from '../../core/mysql'
import Room from '../../models/mysql/Room';
import log from '../../core/logger'
import Packet from '../../core/packet';
import User from '../../models/mysql/User'
import Word from '../../core/word'
//import {authorized_only} from '../../decorators';

export class RoomPost extends Handler {

    //@authorized_only()
    addNew(req, res, next, packet) {
        let user = req.user;
        let title = '';
        let picture_uri = '';
        let global_uri = Word.generate()+Math.round(Math.random()*1000);

        if (!req.body.title) { // || !req.body.picture_uri) {
            packet.error = 'Not enough data';
        } else {
            title = req.body.title;
            picture_uri = req.body.picture_uri;
        }

        if (packet.error) {
            next(packet);
        } else {
            connect.then(async connection => {
                if (!connection || !connection.isConnected) {
                    log.error('typeorm', 'DBConnection error');
                    packet.error = 'Internal error';
                } else {
                    let roomRepository = connection.getRepository(Room);
                    let room = new Room();
                    room.title = title;
                    room.views = 0;
                    room.picture_uri = picture_uri;
                    room.global_uri = global_uri; // WTF?
                    room.creator = user;
                    await roomRepository.save(room);
                    packet.first = 'Ok';
                }
                next(packet);
            })
        }
    }
}