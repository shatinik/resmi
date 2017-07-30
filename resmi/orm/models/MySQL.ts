import { IModel } from '../interfaces/Model'
import { IConnection } from '../../database/interfaces/Connection'
import { Logger as log } from '../../logger'

export namespace MySQL {
  export class Model implements IModel {
    public readonly driver: string = 'mysql';

    private _database: string;
    private _table: string;

    get database() { return this._database }
    get table() { return this._table }

    constructor(connection: IConnection, table: string) {
      if (connection.driver != this.driver) {
        log.error('database', `Incompatible connection driver for model ${this.constructor.toString()}`);
      }

      this._database = connection.database;
      this._table = table;
    }
  }
}