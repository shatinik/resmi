/********************************************************
* Application: Resmi Engine
* Author:      Skrypko Pavel
* File:        Resmi.knex.js
* Description: Knex mysql module
*********************************************************/

const Fs = require('fs');

const Knex = require('knex')({
  client: 'mysql',
  connection: {
  	host    : '127.0.0.1',
    user    : 'root',
    password: '',
    database: 'videosos',
    charset : 'utf8'
  }
});

module.exports = Knex;