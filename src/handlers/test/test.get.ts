import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import User from '../../models/mysql/User'
import log from '../../logger'
import Packet from '../../packet'

export class TestGet extends Handler {
    login(req, res: Response, next: NextFunction, packet: Packet){
        let user: User;
        if (!req.user) {
            log.debug('auth', 'You are not logged in');
            packet.first = 'You are not logged in';
        } else {
            user = req.user[0];
            log.debug('auth', `You are logged in (id=${user.id}, service=${user.service}, service_uid=${user.service_uid})`);
            packet.first = `You are logged in (id=${user.id}, service=${user.service}, service_uid=${user.service_uid})`;
        }
        next(packet);
    }
}