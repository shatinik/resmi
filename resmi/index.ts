/*
* Language: Typescript
* Classname: Resmi.Core
* Author: sam
* Created: 7.7.17
*/

require('./services/Environment');
process.env.service = 'resmi';

import * as Express from 'express'
import { Events } from '../app/events'
import { Logger as log } from './logger'
import * as Passport from 'passport'
import { Authenticate } from './services/Authenticate'

declare interface route {
  method: string,
  uri: string,
  handler: string,
  action: string
}

const git = require('git-rev-sync');
const routes: route[] = require('../configs/routes');

export class Core {
  instance: Express.Application;

  constructor(port: number) {
    this.instance = Express();
    new Authenticate(this.instance);
    this.loadRoutes();
    this.instance.listen(port, function(){
      Core.hello(port);
    });
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

  private loadRoutes(): void {
    this.instance.use(Events.before);
    for (let i in routes) {
      let route = routes[i];
      let action = Core.buildAction(route);
      switch (route.method) {
        case 'get':
          this.instance.get(route.uri, action);
          break;
        case 'post':
          this.instance.post(route.uri, action);
          break;
        case 'put':
          this.instance.put(route.uri, action);
          break;
        case 'delete':
          this.instance.delete(route.uri, action);
          break;
        default:
          log.warn('router', `Route(id: ${i}) assigned to wrong http-method`);
      }
    }
    this.instance.use(Events.after);
  }

  private static buildAction(route: route) {
    let fileName = `../app/handlers/${route.handler}`;
    let handlerName = `${route.handler}Handler`;
    let actionName = route.action;

    return function (req, res, next) {
      let handler = new (require(fileName)[handlerName])(req, res, next, actionName);
      log.debug('router', `Call ${handlerName}::${actionName} from ${req.connection.remoteAddress}`);
    }
  }
}