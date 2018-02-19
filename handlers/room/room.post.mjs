import Handler from '../../core/handler';
import Room from '../../models/mongo/Room';
import User from '../../models/mongo/User';
import log from '../../core/logger'
import Packet from '../../core/packet';
import Word from '../../core/word'

export class RoomPost extends Handler {
    async addNew(req, res, next, packet) {
        if (!req.user) {
            // create user
            req.user = await User.findOne(); // the kostyl. fix it
        }
        if (!req.body.title || !req.body.type) {
            packet.error = 'Not enough data';
        }

        let title = req.body.title;
        let creator = await User.findOne();
        let pictureURL = "";
        let type = req.body.type;

        if (!packet.error) {
            let uniqName = Word.generate();
            try {
                let room = new Room();
                room.init(title, pictureURL, uniqName, creator, type);
                await room.save();
                creator.rooms.push(room);
                await creator.save();
                packet.first = 'Ok';
            } catch (e) {
                packet.error = e;
            }
        }
        next(packet);
    }
}