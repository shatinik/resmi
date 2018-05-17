import * as git from './git';
import log      from './logger'
import ResmiHTTP2 from './core'

const logger = log('system');

import util from 'util';

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
            logger.info(`Current branch: ${git.branch('./')}`);
            logger.info(`Last commit: ${git.date()}`);
            logger.info(`Last commit comment: ${git.message()}`);
            logger.info(`Build hash: ${git.long('./')}`);
            logger.info(`Current version: ${git.tag()}.${git.countTag(git.tag())}.${git.count()}${git.tag(true).indexOf('-dirty') > 0?'-dirty':''}`);
        }
        catch (e) {
            logger.warn(`Current branch: <no git repository found>`);
            logger.warn(`Last commit: ${new Date(0)}`);
            logger.warn(`Last commit comment: <no git repository found>`);
            logger.warn(`Build hash: <no git repository found>`);
            logger.warn(`Current version: <no git repository found>}`);
        }
    }

    async start(port) {
        this.welcomeMessage();
        console.log('=================================================LOADING...=================================================');
        await this.load();
        console.log('=============================================LOADING FINISHED===============================================');
        await Server.httpServer.listen(port);
    }

    async load() {
        Server.httpServer = new ResmiHTTP2();
        await this.loadModules();
    }

    async loadModules() {
        await MongoDB();
    }

    constructor(project) {
        this.project = project;
    }
}