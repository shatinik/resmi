import mongoose  from 'mongoose';
import logger       from './logger'
import config    from '../configs/development/mongo'
const log = logger('mongo');

mongoose.Promise = global.Promise;
export default async function connect() {
    log.info(`Connection to ${config.url}...`);
    try {
        let connection = await mongoose.connect(config.url, {useMongoClient: true});
        log.info('Successfully connected.');
    } catch (e) {
        log.error(`Connection error: ${e.message}`);
    }
}