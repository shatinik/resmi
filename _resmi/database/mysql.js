let config = require(`../../configs/${global.env}/mysql`);
module.exports = require('knex')({
    client: 'mysql',
    connection: {
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        charset: config.charset
    }
});