const config = require(`../../configs/${global.env}/mongo`);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const log = require('../logger');
mongoose.connect(config.url);
var db = mongoose.connection;
db.on('error', function (Error) {
    log.error('mongo', `Connection error: ${Error.message}`);
});
db.once('open', function () {
    log.info('mongo', "Successfully connected.");
});

var roomsSchema = new Schema({
    url: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: Number, required: true },
});
var roomsModel = mongoose.model('rooms', roomsSchema);

module.exports = {
    rooms: roomsModel
}