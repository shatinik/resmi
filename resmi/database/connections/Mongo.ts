import { IConnection } from '../interfaces/Connection'
import * as Mongoose from 'mongoose';
import { Logger as log } from '../../logger'

export class MongoConnection implements IConnection {
  private instance: Mongoose.Connection;
  public readonly driver = 'mysql';

  get connection(): Mongoose.Connection { return this.instance }

  constructor(host: string, database: string, port?: number, options?: Mongoose.ConnectionOptions ) {
    this.instance = Mongoose.createConnection(host, database, port, options);

    this.connection.on('error', function (Error) {
      log.error('mongo', `Connection error: ${Error.message}`);
    });
    this.connection.once('open', function () {
      log.info('mongo', "Successfully connected.");
    });
  }
}