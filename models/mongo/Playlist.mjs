import mongoose from 'mongoose'
import {model as User} from './User'
import {model as Room} from './Room'

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
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    type: Number,
    videos: [{
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }],
};

export class Playlist {
    init(creator, type, videos, title) {
        this.creator = creator;
        this.type = type;
        this.videos = [];
        this.title = title;
    }

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

export let schema = new Schema(_fields, options).loadClass(Playlist);
export let model = mongoose.model('Playlist', schema);
export default model;