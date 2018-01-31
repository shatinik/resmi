import typeorm from "typeorm";
import log from './logger'

import config from '../configs/development/mysql';
let connect = typeorm.createConnection({
    type: "mysql",
    host: config.host,
    port: 3306,
    username: config.user,
    password: config.password,
    database: config.database,
    entities: [
        "../models/mysql/*.mjs",
    ],
    autoSchemaSync: true,
}).catch(error => log.error('typeorm', error));
export default connect;
