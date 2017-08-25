import * as http from 'http';
import * as express from 'express';
import Application from './application';
import Routes from './routes'
import * as socket from 'socket.io'
import * as git from 'git-rev-sync';
import log from './logger';

export default class Server {

    private express: express.Application;
    private socket: SocketIO.Server;
    private port: number;
    private static httpServer: http.Server;

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') { 
            throw error; 
        }
    }

    private onListening(): void {
        let serverAddr = Server.httpServer.address();
    }

    private loadEventListeners(): void {
        Server.httpServer.on('error', this.onError);
        Server.httpServer.on('listening', this.onListening);
    }

    private static hello(port: number): void {
        log.info('system', `Framework name: resmi(typescript)`);
        try {
            log.info('system', `Current branch: ${git.branch()}`);
            log.info('system', `Last commit: ${git.date()}`);
            log.info('system', `Build hash: ${git.long()}`);
            log.info('system', `Current version: ${git.tag(true)}`);
        }
        catch (e) {
            log.warn('system', `Current branch: <no git repository found>`);
            log.warn('system', `Last commit: ${new Date(0)}`);
            log.warn('system', `Build hash: <no git repository found>`);
            log.warn('system', `Current version: <no git repository found>}`);
        }
        log.info('system', `Listening port: ${port}`);
        log.info('system', `NODE_MODE: ${process.env.NODE_ENV}`);
    }

    public start(): void {
        Server.hello(this.port);
        Routes.load(this.express, this.socket);
        this.loadEventListeners();
        Server.httpServer.listen(this.port);
    }

    constructor(app: Application, port: number) {
        this.express = app.express;
        this.port = port;
        Server.httpServer = http.createServer(this.express);
        this.socket = socket(Server.httpServer);
    }
}