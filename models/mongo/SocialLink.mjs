import mongoose from 'mongoose'
import {schema as User} from './User'
import User from './User'

const Schema = mongoose.Schema;
const Model = mongoose.model;

var options = {
    autoIndex: null, //bool - defaults to null (which means use the connection's autoIndex option)
    bufferCommands: true, //bool - defaults to true
    capped: false, //bool - defaults to false
    collection: 'sociallinks', //string - no default
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
    User: User,
    Social: String,
    SocialID: String
};

class SocialLink {

}

export let schema = new Schema(_fields, options).loadClass(SocialLink);
export let model = mongoose.model('SocialLink', schema);
export default model;