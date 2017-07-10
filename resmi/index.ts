/*
* Language: Typescript
* Classname: Resmi.Core
* Author: sam
* Created: 7.7.17
*/

import {route} from './index.d'; // !!!
require('./services/Environment');
process.env.service = 'resmi';

import * as Express from 'express'
import { Events } from '../app/events'
import { Logger as log } from './logger'

const git = require('git-rev-sync');
const routes: route[] = require('../configs/routes');

export namespace Core {
  let instance: Express.Application;

  export function start(port: number) {
    instance = Express();
    loadRoutes();
    instance.listen(port, function(){
      hello(port);
    });
  }

  function hello(port) {
    log.info('system', `Framework name: resmi(typescript)`);
    try {
      // throw Error('test');
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

  function loadRoutes() {
    instance.use(Events.before);
    for (let i in routes) {
      let route = routes[i];
      let action = require(`../app/handlers/${route.handler}`)[`${route.handler}Handler`][route.action];
      switch (route.method) {
        case 'get':
          instance.get(route.uri, action);
          break;
        case 'post':
          instance.post(route.uri, action);
          break;
        case 'put':
          instance.put(route.uri, action);
          break;
        case 'delete':
          instance.delete(route.uri, action);
          break;
        default:
          log.warn('router', `Route(id: ${i}) assigned to wrong http-method`);
      }
    }
    instance.use(Events.after);
  }
}