import * as mongoose from 'mongoose';
import { Logger as log } from '../logger'

const config = require(`../../configs/${process.env.NODE_ENV}/mongo`);
const Schema = mongoose.Schema;

mongoose.connect(config.url);

let db = mongoose.connection;

db.on('error', function (Error) {
    log.error('mongo', `Connection error: ${Error.message}`);
});
db.once('open', function () {
    log.info('mongo', "Successfully connected.");
});

let roomsSchema = new Schema({
    url: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: Number, required: true },
});
let roomsModel = mongoose.model('rooms', roomsSchema);

export {
    roomsModel as rooms
}