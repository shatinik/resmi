import mongoose from 'mongoose';
import log from './logger'
import config  from '../configs/development/mongo';

export function connect() {
    mongoose.connect(config.url, {useMongoClient: true});
    
    mongoose.connection.on('error', function (Error) {
        log.error('mongo', `Connection error: ${Error.message}`);
    });
    mongoose.connection.once('openUri', function () {
        log.info('mongo', "Successfully connected.");
    });
}