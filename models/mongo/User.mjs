import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const Model = mongoose.model;

var options = {
    autoIndex: null, //bool - defaults to null (which means use the connection's autoIndex option)
    bufferCommands: true, //bool - defaults to true
    capped: false, //bool - defaults to false
    collection: 'users', //string - no default
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
    name: String,
    email: String,
    created_at: String,
    last_auth: String,
    picture_full_uri: String,
    picture_cut_uri: String,
    service: Number,
    service_uid: Number,
    token: String,
    rooms: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Room'
    }],
    favorites: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Room'
    }]
};

class User {
    getID() {
        return this._id;
    }
}

export let schema = new Schema(_fields, options).loadClass(User);
export let model = mongoose.model('User', schema);
export default model;