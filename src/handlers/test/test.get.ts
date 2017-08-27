import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import User from '../../models/mysql/User'
import log from '../../logger'
import Packet from '../../packet'
import Auth from '../../authenticate';
import { JWTSecret, JWTObject } from '../../authenticate';
import * as jwt from 'jsonwebtoken'

export class TestGet extends Handler {
    login(req, res: Response, next: NextFunction, packet: Packet){
        let user: User;
        if (!req.user) {
            log.debug('auth', 'You are not logged in');
            packet.first = 'You are not logged in';
        } else {
            user = req.user;
            log.debug('auth', `You are logged in (id=${user.id}, service=${user.service}, service_uid=${user.service_uid})`);
            packet.first = `You are logged in (id=${user.id}, service=${user.service}, service_uid=${user.service_uid})`;
        }
        next(packet);
    }

    async webtoken(req, res: Response, next: NextFunction, packet: Packet) {
        let JWT = req.query.JWT; // req.header('JWT');
        if (JWT) {
            try {
                let payload: any = jwt.verify(JWT, JWTSecret);
                if (typeof payload === 'string') {
                    packet.error = payload;
                    log.error('auth', payload);
                } else {
                    let jwt: JWTObject = payload;
                    let id: number = Number(jwt.data);
                    if (isNaN(id)) {
                        packet.error =  `Wrong data written to JWT ${jwt} when number expected`;
                        log.error('auth', `Wrong data written to JWT ${jwt} when number expected`);
                    } else {
                        let user = await Auth.deserialize(id);
                        packet.first = `JWT (id=${user.id}, service=${user.service}, service_uid=${user.service_uid})`;
                    }
                }
            } catch (e) {
                packet.error = `${e.name}`;
                log.debug('auth', `${e} from ${req.connection.remoteAddress}`);
            }
        } else {
            packet.first = 'Blank JWT'
        }
        next(packet);
    }
}