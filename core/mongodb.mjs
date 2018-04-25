import mongoose  from 'mongoose';
import log       from './logger'
import config    from '../configs/development/mongo';

const logger = log('mongo');

export default function connect() {
    mongoose.connect(config.url, {useMongoClient: true}, err => {

        if (err) { logger.error(`Connection error: ${Error.message}`); }
        
        logger.info('Successfully connected.');
    });
}