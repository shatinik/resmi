//import {createConnection} from "typeorm";
import log from './logger'

import config from '../configs/development/mysql';
let connect = undefined;
/*createConnection({
    type: "mysql",
    host: config.host,
    port: 3306,
    username: config.user,
    password: config.password,
    database: config.database,
    entities: [
        __dirname + "/models/mysql/*.js",
    ],
    autoSchemaSync: true,
}).catch(error => log.error('typeorm', error));
*/
export default connect;