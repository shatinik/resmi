process.env.NODE_ENV = 'development';
process.env.service = 'videosos';
import Server        from './server';
import Application   from '../modules/application/application';
import log           from './logger';
import MongoDB       from './mongodb'

/*
Здесь собирается и запускается движок
*/
let app = new Application();
MongoDB();
let server = new Server("resmi.ni", 1337);
server.start();