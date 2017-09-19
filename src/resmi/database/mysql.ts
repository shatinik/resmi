import {createConnection} from "typeorm";
import log from '../../logger/index'

interface mysqlConfig {
    host: string
    user: string
    password: string
    database: string
    charset: string
}

let config: mysqlConfig = require(`../../../configs/${process.env.NODE_ENV}/mysql`);
let connect = createConnection({
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

export default connect;