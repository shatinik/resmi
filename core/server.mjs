import socket from 'socket.io'
import * as git from './git';
import log from './logger';
import http2 from 'http2';
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

export default class Server {

    hello() {
        console.log('====================================================INFO====================================================');

        log.info('system', `Framework name: resmi`);
        log.info('system', `Project name: ${this.project}`);
        try {
            log.info('system', `Current branch: ${git.branch('/home/sam/resmi')}`);
            log.info('system', `Last commit: ${git.date()}`);
            log.info('system', `Last commit comment: ${git.message()}`);
            log.info('system', `Build hash: ${git.long('/home/sam/resmi')}`);
            log.info('system', `Current version: ${git.tag()}.${git.countTag(git.tag())}.${git.count()}${git.tag(true).indexOf('-dirty') > 0?'-dirty':''}`);
        }
        catch (e) {
            log.warn('system', `Current branch: <no git repository found>`);
            log.warn('system', `Last commit: ${new Date(0)}`);
            log.warn('system', `Last commit comment: <no git repository found>`);
            log.warn('system', `Build hash: <no git repository found>`);
            log.warn('system', `Current version: <no git repository found>}`);
        }
        log.info('system', `Listening port: ${this.port}`);
        console.log('=================================================LOADING...=================================================');
    }

    resmi() {
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

    start() {
        this.resmi();
        this.hello();
        console.log('=============================================LOADING FINISHED===============================================');
        Server.httpServer.listen(this.port);
    }

    call(handler, method) {

    }

    constructor(project, port) {
        this.project = project;
        this.port = port;

        const server = Server.httpServer = http2.createSecureServer({
            key: fs.readFileSync('localhost-privkey.pem'),
            cert: fs.readFileSync('localhost-cert.pem')
        });

        server.on('error', (err) => log.error(err));
          
        server.on('stream', (stream, headers, flags) => {
            // stream is a Duplex
            log.debug('system', util.inspect(headers));
            const myURL = new URL(headers[HTTP2_HEADER_PATH], 'https://doesnotmatter.host');
            stream.respond({
                'content-type': 'text/html',
                ':status': 200
            });
            stream.end(util.inspect(myURL));
        });
    }
}