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
                room._init(title, pictureURL, uniqName, creator, type);
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

    async loadVideo(req, res, next, packet) {
        if (!req.body.uniqName || !req.body.Title || !req.body.Service || !req.body.ExternalID) {
            packet.error = 'Not enough data';
        } else if (isNaN(req.body.Service)) {
            packet.error = 'Service is NaN';
        }

        if (!packet.error) {
            let uniqName = req.body.uniqName;
            let Title = req.body.Title;
            let Service = req.body.Service;
            let ExternalID = req.body.ExternalID;
            let room = await Room.loadByUniqName(uniqName);
            room.addAndPlayVideo({Title: Title, Service: Service, ExternalID: ExternalID, creator: req.user});
            room.save();
            packet.first = 'Ok';
        }
        next(packet);
    }
}