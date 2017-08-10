import * as http from 'http';
import * as express from 'express';
import Application from './application';
import Routes from './routes'

export default class Server {

    private express: express.Application;
    private port: number;
    private static httpServer: http.Server;

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') { 
            throw error; 
        }
    }

    private onListening(): void {
        let serverAddr = Server.httpServer.address();
        console.log(`Server is running on port ${serverAddr.port}`);
    } 

    private loadEventListeners(): void {
        Server.httpServer.on('error', this.onError);
        Server.httpServer.on('listening', this.onListening);
    }

    public start(): void {
        Routes.load(this.express);
        this.loadEventListeners();
        Server.httpServer.listen(this.port);
    }

    constructor(app: Application, port: number) {
        this.express = app.express;
        this.port = port;
        Server.httpServer = http.createServer(this.express);
    }
}