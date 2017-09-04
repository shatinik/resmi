import * as http from 'http';
import * as express from 'express';
import Application from './application';
import Routes from './routes'
import * as socket from 'socket.io'
import * as git from './shared/git';
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
        console.log('====================================================INFO====================================================');

        log.info('system', `Framework name: resmi(typescript)`);
        try {
            log.info('system', `Current branch: ${git.branch()}`);
            log.info('system', `Last commit: ${git.date()}`);
            log.info('system', `Last commit comment: ${git.message()}`);
            log.info('system', `Build hash: ${git.long()}`);
            log.info('system', `Current version: ${git.tag()}.${git.countTag(git.tag())}.${git.count()}${git.tag(true).indexOf('-dirty') > 0?'-dirty':''}`);
        }
        catch (e) {
            log.warn('system', `Current branch: <no git repository found>`);
            log.warn('system', `Last commit: ${new Date(0)}`);
            log.warn('system', `Last commit comment: <no git repository found>`);
            log.warn('system', `Build hash: <no git repository found>`);
            log.warn('system', `Current version: <no git repository found>}`);
        }
        log.info('system', `Listening port: ${port}`);
        log.info('system', `NODE_MODE: ${process.env.NODE_ENV}`);
        console.log('=================================================LOADING...=================================================');
    }

    private static resmi(): void {
        console.log('============================================================================================================');
        console.log(' RRRRRRRRRRRRRRRRR    EEEEEEEEEEEEEEEEEEEEEE    SSSSSSSSSSSSSSS  MMMMMMMM               MMMMMMMM IIIIIIIIII');
        console.log(' R::::::::::::::::R   E::::::::::::::::::::E  SS:::::::::::::::S M:::::::M             M:::::::M I::::::::I');
        console.log(' R::::::RRRRRR:::::R  E::::::::::::::::::::E S:::::SSSSSS::::::S M::::::::M           M::::::::M I::::::::I');
        console.log(' RR:::::R     R:::::R EE::::::EEEEEEEEE::::E S:::::S     SSSSSSS M:::::::::M         M:::::::::M II::::::II');
        console.log('   R::::R     R:::::R   E:::::E       EEEEEE S:::::S             M::::::::::M       M::::::::::M   I::::I');
        console.log('   R::::R     R:::::R   E:::::E              S:::::S             M:::::::::::M     M:::::::::::M   I::::I');
        console.log('   R::::RRRRRR:::::R    E::::::EEEEEEEEEE     S::::SSSS          M:::::::M::::M   M::::M:::::::M   I::::I');
        console.log('   R:::::::::::::RR     E:::::::::::::::E      SS::::::SSSSS     M::::::M M::::M M::::M M::::::M   I::::I');
        console.log('   R::::RRRRRR:::::R    E:::::::::::::::E        SSS::::::::SS   M::::::M  M::::M::::M  M::::::M   I::::I');
        console.log('   R::::R     R:::::R   E::::::EEEEEEEEEE           SSSSSS::::S  M::::::M   M:::::::M   M::::::M   I::::I');
        console.log('   R::::R     R:::::R   E:::::E                          S:::::S M::::::M    M:::::M    M::::::M   I::::I');
        console.log('   R::::R     R:::::R   E:::::E       EEEEEE             S:::::S M::::::M     MMMMM     M::::::M   I::::I');
        console.log(' RR:::::R     R:::::R EE::::::EEEEEEEE:::::E SSSSSSS     S:::::S M::::::M               M::::::M II::::::II');
        console.log(' R::::::R     R:::::R E::::::::::::::::::::E S::::::SSSSSS:::::S M::::::M               M::::::M I::::::::I');
        console.log(' R::::::R     R:::::R E::::::::::::::::::::E S:::::::::::::::SS  M::::::M               M::::::M I::::::::I');
        console.log(' RRRRRRRR     RRRRRRR EEEEEEEEEEEEEEEEEEEEEE  SSSSSSSSSSSSSSS    MMMMMMMM               MMMMMMMM IIIIIIIIII');
        console.log('============================================================================================================');
    }

    public start(): void {
        Server.resmi();
        Server.hello(this.port);
        Routes.load(this.express, this.socket);
        this.loadEventListeners();
        console.log('=============================================LOADING FINISHED===============================================');
        Server.httpServer.listen(this.port);
    }



    constructor(app: Application, port: number) {
        this.express = app.express;
        this.port = port;
        Server.httpServer = http.createServer(this.express);
        this.socket = socket(Server.httpServer);
    }
}