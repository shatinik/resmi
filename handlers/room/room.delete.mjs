import Handler from '../../core/handler';
import connect from '../../core/mysql'
import Room from '../../models/mysql/Room';
import log from '../../core/logger'
import Packet from '../../core/packet';
import User from '../../models/mysql/User';

export class RoomDelete extends Handler {
    async deleteById(req, res, next, packet) {
        let roomId = req.query.id;

        if (!roomId) {
            packet.error = 'Not enough data';
        } else if (!mongoose.Types.ObjectId.isValid(roomId)) {
            packet.error = 'roomId is not valid';
        }

        if (!packet.error) {
            let room = await Room.findOne({ _id: id });
            if (!room) {
                packet.error = `No room with ID ${id}`;
            } else {
                await room.remove();
            }
        }
        next(packet);
    }

    async deleteAllByCreatorId(req, res, next, packet) {
        let creatorId = req.query.creator;

        if (!req.query.creator) {
            packet.error = 'Not enough data';
        } else if (!mongoose.Types.ObjectId.isValid(creatorId)) {
            packet.error = 'creatorId is not valid';
        }

        if (!packet.error) {
            let userRepository = connection.getRepository(User);
            let creator = await User.findOne({ _id: creator_id }).populate('Room').exec();
            if (!creator) {
                packet.error = `No user with id ${creator_id}`;
            } else if (!creator.rooms) {
                packet.error = `There are no rooms of user ${creator_id}`;
            } else{
                for (let i = 0; i < creator.rooms.length; i++) {
                    await creator.rooms[i].remove();
                }
            }
        }
        next(packet);
    }
}