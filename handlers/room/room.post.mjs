import Handler from '../../core/handler';
import Room from '../../models/mongo/Room';
import User from '../../models/mongo/User';
import log from '../../core/logger'
import Packet from '../../core/packet';
import Word from '../../core/word'

export class RoomPost extends Handler {

    async addNew(req, res, next, packet) {
        //let user = req.user;
        let user = await User.findOne();
        let title = '';
        let picture_uri = '';
        let global_uri = Word.generate() + Math.round(Math.random() * 1000);

        if (!req.body.title) {
            packet.error = 'Not enough data';
        } else {
            title = req.body.title;
            picture_uri = req.body.picture_uri;
        }

        if (!packet.error) {
            let room = new Room();
            room.title = title;
            room.views = 0;
            room.picture_uri = picture_uri;
            room.global_uri = global_uri; // WTF?
            room.creator = user;
            await room.save();
            packet.first = 'Ok';
        }
        next(packet);
    }
}