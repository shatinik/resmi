import Schema from '../../schemas/room'
import mongoose from 'mongoose'
import util from 'util';

class Room {

}

export default mongoose.model('Room', Schema.loadClass(Room));