import {Application} from '../application';
import { Request, Response, NextFunction  } from 'express'
import { Logger as log } from '../../resmi/logger'
import {User} from '../../resmi/entity/User';

export class testHandler extends Application {
  before_action(req: Request, res: Response, next: NextFunction, action: string) {
    if (req.user) {
      let user: User = req.user[0];
      log.debug('auth', `You are logged in (id=${user.id}, service=${user.service}, service_uid=${user.service_uid})`)
      return true;
    } else {
      log.debug('auth', 'You are not logged in');
      res.json();
      return false;
    }
  }

  main(req: Request, res: Response, next: NextFunction){
    res.json('Action `main` loaded');
  }
}