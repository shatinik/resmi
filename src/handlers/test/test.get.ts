import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import User from '../../models/mysql/User'
import log from '../../logger'

export class TestGet extends Handler {
    login(req, res: Response, next: NextFunction){
        if (req.user) {
            let user: User = req.user[0];
            log.debug('auth', `You are logged in (id=${user.id}, service=${user.service}, service_uid=${user.service_uid})`)
            res.json('You are logged in');
            return true;
        } else {
            log.debug('auth', 'You are not logged in');
            res.json('You are not logged in');
            return false;
        }
    }
}