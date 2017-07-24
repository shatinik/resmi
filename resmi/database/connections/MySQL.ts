import { IConnection } from '../interfaces/Connection'
import { Logger as log } from '../../logger'
import * as Knex from 'knex';

export class MySQLConnection implements IConnection {
  private instance: Knex;
  public readonly driver = 'mysql';

  get connection(): Knex { return this.instance }

  constructor(host: string, user: string, password: string, database: string, options: Knex.Config) {
    let args = {
      client: 'mysql',
      connection: {
        host: host,
        user: user,
        password: password,
        database: database
      }
    };
    (<any>Object).assign(args, options);
    this.instance = Knex(args);
  }
}