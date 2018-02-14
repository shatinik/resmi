import mongoose from 'mongoose'
import Room from './Room'

const Schema = mongoose.Schema;

let _fields = {
    Video: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    currentStatus: Number,
    currentPosition: String
};

class Videoplayer {
    getType() {
        switch(this.currentStatus) {
            case 1:
                return 'stop';
            case 2:
                return 'pause';
            case 3:
                return 'play';
            default:
                return 'Unknown status'
        }
    }
}

export let schema = new Schema(_fields, options).loadClass(Videoplayer);
export default schema;