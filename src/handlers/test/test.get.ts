import Handler from '../../resmi/handler';
import { Request, Response, NextFunction  } from 'express'
import User from '../../models/mysql/User'
import log from '../../logger'
import Packet from '../../resmi/packet'
import Authenticate from '../../authenticate';
import { JWTSecret, JWTObject } from '../../authenticate';
import * as jwt from 'jsonwebtoken'
import { Connection } from 'typeorm';
import connect from '../../resmi/database/mysql'

export class TestGet extends Handler {
    login(req, res: Response, next: NextFunction, packet: Packet<any>){
        if (!req.user) {
            packet.first = 'You are not logged in';
        } else {
            let user: User = req.user;
            packet.first = `You are logged in (id=${user.id}, service=${user.service}, service_uid=${user.service_uid})`;
        }
        next(packet);
    }

    async webtoken(req, res: Response, next: NextFunction, packet: Packet<any>) {
        let JWT = req.query.JWT; // req.header('JWT');
        if (!JWT) {
            packet.error = 'Blank JWT'
        } else {
            try {
                let payload: any = jwt.verify(JWT, JWTSecret);
                if (typeof payload === 'string') {
                    log.error('auth', payload);
                } else {
                    let token: JWTObject = payload;
                    let id: number = Number(token.data);
                    if (isNaN(id)) {
                        log.error('auth', `Wrong data written to JWT ${token} when number expected`);
                    } else {
                        req.user = await Authenticate.deserialize(id);
                    }
                }
            } catch (e) {
                if (e instanceof jwt.TokenExpiredError) {
                    let connection = await connect;
                    if (!connection || connection instanceof Connection && !connection.isConnected) {
                        log.error('typeorm', 'DBConnection error');
                    } else {
                        try {
                            let payload: any = jwt.verify(JWT, JWTSecret, {ignoreExpiration: true});
                            if (typeof payload === 'string') {
                                log.error('auth', payload);
                            } else {
                                let token: JWTObject = payload;
                                let id: number = Number(token.data);
                                let userRepository = connection.getRepository(User);
                                let user = await userRepository.findOne({token: JWT});
                                if (!user) {
                                    user = await userRepository.findOneById(id);
                                    console.log(id);
                                    if (!user) {
                                        log.warn('auth', 'Wrong token accepted. User deleted or it is fake token(secret key had been stolen?)')
                                    } else {
                                        log.warn('auth', 'Wrong token accepted. It is old or fake(secret key had been stolen?)')
                                        // Старым он может быть только в случае, если в базе хранится только токен для одной последней сессии. Иначе - однозначно фейк
                                    }
                                } else {
                                    user.token = req.new_token = jwt.sign({ data: user.id }, JWTSecret, { expiresIn: '24h' });
                                    log.debug('auth', `New token generated for user ${user.id}`);
                                    await userRepository.save(user);
                                    req.user = user;
                                }
                            }
                        } catch (e) {
                            log.error('auth', `${e} from ${req.connection.remoteAddress}`);
                        }
                    }
                }
                log.debug('auth', `${e} from ${req.connection.remoteAddress}`);
            }
        }
        this.login(req,res,next,packet);
    }
}