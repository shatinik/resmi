process.env.NODE_ENV = 'development';
process.env.service = 'videosos';
import Server        from './server';

/*
Здесь собирается и запускается движок
*/
let server = new Server("resmi.ni", 1337);
server.start();