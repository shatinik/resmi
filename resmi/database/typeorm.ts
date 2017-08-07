import {createConnection} from "typeorm";
import { Logger as log } from '../logger'

interface mysqlConfig {
  host: string
  user: string
  password: string
  database: string
  charset: string
}

let config: mysqlConfig = require(`../../configs/${process.env.NODE_ENV}/mysql`);
export let connect = createConnection({
  type: "mysql",
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '',
  database: 'videosos',
  entities: [
    __dirname + "/../../app/entity/*.js",
    __dirname + "/../entity/*.js",
  ],
  autoSchemaSync: true,
}).catch(error => log.error('typeorm', error));