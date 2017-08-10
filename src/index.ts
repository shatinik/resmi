process.env.NODE_ENV = 'development';
import Server from './server';
import Application from './application';
import log from './logger'

/*
Здесь собирается и запускается движок
*/
let app = new Application();
let server = new Server(app, 1337);
server.start();