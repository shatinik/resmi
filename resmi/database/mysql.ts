let config = require(`../../configs/${process.env.NODE_ENV}/mysql`);
import * as knex from 'knex';

export let MySQL = knex({
  client: 'mysql',
  connection: {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    charset: config.charset
  }
});