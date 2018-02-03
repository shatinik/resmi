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
            let room = await Room.findOne({ _id: roomId }).populate('creator').exec();
            if (!room) {
                packet.error = `No room with ID ${roomId}`;
            } else {
                room.creator.rooms.remove(room);
                await room.creator.save();
                await room.remove();
                packet.first = 'Ok';
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
            let creator = await User.findOne({ _id: creatorId }).populate('rooms').exec();
            if (!creator) {
                packet.error = `No user with id ${creatorId}`;
            } else if (!creator.rooms || creator.rooms.length == 0) {
                packet.error = `There are no rooms of user ${creatorId}`;
                // Also will executed when all ObjectId`s are refering to nothing
            } else{
                for (let i = 0; i < creator.rooms.length; i++) {
                    // Not iterating at ObjectId`s that are referring to nothing
                    try {
                        await creator.rooms[i].remove();
                    } catch (e) {
                        packet.error = `There are no room with _id ${creator.rooms[i].depopulate()}`;
                    }
                }
                if (!packet.error) {
                    creator.rooms = [];
                    await creator.save();
                    packet.first = 'Ok';
                }
            }
        }
        next(packet);
    }
}