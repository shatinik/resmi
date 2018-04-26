import socket   from 'socket.io'
import * as git from './git';
import log      from './logger';
import http2    from 'http2';

const logger = log('system');
const {
    HTTP2_HEADER_METHOD,
    HTTP2_HEADER_PATH,
    HTTP2_HEADER_STATUS,
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_HEADER_SCHEME,
    HTTP2_HEADER_AUTHORITY
  } = http2.constants;
import URLUtil from 'url';

const {
    URL
} = URLUtil;

import util from 'util';
import fs from 'fs';

/*
*   Import core-modules
*/
import MongoDB  from '../modules/mongodb'

export default class Server {

    welcomeMessage() {
        this.showLogo();
        this.revInfo();
    }
    
    showLogo() {
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

    revInfo() {
        console.log('====================================================INFO====================================================');

        logger.info(`Framework name: resmi`);
        logger.info(`Project name: ${this.project}`);
        try {
            logger.info(`Current branch: ${git.branch('/home/sam/resmi')}`);
            logger.info(`Last commit: ${git.date()}`);
            logger.info(`Last commit comment: ${git.message()}`);
            logger.info(`Build hash: ${git.long('/home/sam/resmi')}`);
            logger.info(`Current version: ${git.tag()}.${git.countTag(git.tag())}.${git.count()}${git.tag(true).indexOf('-dirty') > 0?'-dirty':''}`);
        }
        catch (e) {
            logger.warn(`Current branch: <no git repository found>`);
            logger.warn(`Last commit: ${new Date(0)}`);
            logger.warn(`Last commit comment: <no git repository found>`);
            logger.warn(`Build hash: <no git repository found>`);
            logger.warn(`Current version: <no git repository found>}`);
        }
        logger.info(`Listening port: ${this.port}`);
    }

    async start() {
        this.welcomeMessage();
        console.log('=================================================LOADING...=================================================');
        await this.load();
        console.log('=============================================LOADING FINISHED===============================================');
        Server.httpServer.listen(this.port);
    }

    async load() {
        await this.loadHttpServer();
        await this.loadModules();
    }

    async loadModules() {
        await MongoDB();
    }

    async loadHttpServer() {
        Server.httpServer = await http2.createSecureServer({
            key: fs.readFileSync('localhost-privkey.pem'),
            cert: fs.readFileSync('localhost-cert.pem')
        });

        Server.httpServer.on('error', (err) => logger.error(err));
          
        Server.httpServer.on('stream', (stream, headers, flags) => {
            const myURL = new URL(headers[HTTP2_HEADER_PATH], 'https://doesnotmatter.host');
            stream.respond({
                'content-type': 'text/html',
                ':status': 200
            });
        });
    }

    constructor(project, port) {
        this.project = project;
        this.port = port;
    }
}