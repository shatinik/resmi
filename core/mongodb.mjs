import {connect, Schema, connection} from 'mongoose';
import log from './logger'

import config  from '../../configs/development/mongo';

connect(config.url);

connection.on('error', function (Error) {
    log.error('mongo', `Connection error: ${Error.message}`);
});
connection.once('open', function () {
    log.info('mongo', "Successfully connected.");
});