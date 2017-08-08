import * as http from 'http';
import * as express from 'express';

export class Server {
    
    private httpServer: http.Server;

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') { 
            throw error; 
        }
    }

    private onListening(): void {
        let serverAddr = this.httpServer.address();
        console.log(`Server is running on port ${serverAddr.port}`);
    } 

    private loadEventListeners(): void {
        this.httpServer.on('error', this.onError);
        this.httpServer.on('listening', this.onListening);
    }

    constructor(app: express.Application, port: number) {
        this.httpServer = http.createServer(app);
        this.loadEventListeners();
        this.httpServer.listen(port);
    }
}