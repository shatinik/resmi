import mongoose from 'mongoose'
import {schema as User} from './User'
import {_fields as Videoplayer} from './Videoplayer'
import {_fields as Video} from './Video'

const Schema = mongoose.Schema;
const Model = mongoose.model;

var options = {
    autoIndex: null, //bool - defaults to null (which means use the connection's autoIndex option)
    bufferCommands: true, //bool - defaults to true
    capped: false, //bool - defaults to false
    collection: 'rooms', //string - no default
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

let _fields = {
    uniqName: String,
    title: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    pictureURL: String,
    currentPlaylist: {
        type: Schema.Types.ObjectId,
        ref: 'Playlist'
    },
    historyPlaylist: [Video],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    type: Number,
    viewers: Number,
    totalViewers: Number,
    videoplayer: Videoplayer,
};

class Room {
    getType() {
        switch(this.type) {
            case 1:
                return 'public';
            case 2:
                return 'private';
            case 3:
                return 'test';
            default:
                return 'Unknown type'
        }
    }
}

export let schema = new Schema(_fields, options).loadClass(Room);
export let model = mongoose.model('Room', schema);
export default model;