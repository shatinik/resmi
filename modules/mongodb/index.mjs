import mongoose  from 'mongoose';
import log       from '../../core/logger'
import config    from '../../configs/development/mongo'
import util from 'util'
const logger = log('mongo');

mongoose.Promise = global.Promise;
export default async function connect() {
    logger.info(`Connection to ${config.url}...`);
    try {
        let connection = await mongoose.connect(config.url, {useMongoClient: true});
        logger.info('Successfully connected.');
    } catch (e) {
        logger.error(`Connection error: ${e.message}`);
    }
}