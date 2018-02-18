import mongoose from 'mongoose'
import Room from './Room'

const Schema = mongoose.Schema;

var options = {
    autoIndex: null, //bool - defaults to null (which means use the connection's autoIndex option)
    bufferCommands: true, //bool - defaults to true
    capped: false, //bool - defaults to false
    collection: 'videos', //string - no default
    emitIndexErrors: false, //bool - defaults to false.
    id: true, //bool - defaults to true
    _id: true, //bool - defaults to true
    minimize: true, //bool - controls document#toObject behavior when called manually - defaults to true
    //read: '', //string
    safe: true, //bool - defaults to true.
    shardKey: null, //bool - defaults to null
    strict: true, //bool - defaults to true
    //toJSON: {}, //- object - no default
    //toObject: {}, //- object - no default
    typeKey: 'type', //- string - defaults to 'type'
    useNestedStrict: false, //- boolean - defaults to false
    validateBeforeSave: true, //- bool - defaults to true
    versionKey: '__v', //string - defaults to "__v"
    collation: null, //object - defaults to null (which means use no collation)
};

export let _fields = {
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