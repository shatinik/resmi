import Handler from '../../handler';
import * as Passport from 'passport'
import log from '../../logger'
import { Request, Response, NextFunction  } from 'express'
import Packet from '../../packet'
import * as jwt from 'jsonwebtoken'
import { JWTSecret } from '../../authenticate';
import connect from '../../mysql'
import User from '../../models/mysql/User';
import { Connection } from 'typeorm';


export class AuthGet extends Handler {
    currentUser(req, res: Response, next: NextFunction, packet: Packet) {
        if (!req.user) {
            packet.error = 'You are not logged in';
        } else {
            packet.first = req.user;
        }
        next(packet);
    }

    check(req, res: Response, next: NextFunction, packet: Packet) {
        packet.first = !!req.user;
        next(packet);
    }

    vkCallback(req: Request, res: Response, next: NextFunction, packet: Packet) {
        Passport.authenticate('vkontakte'/*-token*/, { session: false }, this.authCallback(req, res, next, packet))(req,res,next)
    }

    facebookCallback(req: Request, res: Response, next: NextFunction, packet: Packet) {
        Passport.authenticate('facebook-token', { session: false }, this.authCallback(req, res, next, packet))(req,res,next)
    }


    vk(req: Request, res: Response, next: NextFunction) {
        Passport.authenticate('vkontakte')(req,res,next);
    }

    logout(req, res: Response, next: NextFunction, packet: Packet) {
        if (req.user) {
            req.logout();
            packet.first = 'Ok';
        } else {
            packet.error = 'You are not logged in';
        }
        next(packet);
    }

    private authCallback(req: Request, res: Response, next: NextFunction, packet: Packet) {
        return (err, user, info) => {
            if (err) {
                packet.error = err;
            } else {
                if (!user) {
                    packet.error = 'Unknown error';
                } else {
                    req.logIn(user, async (err) => {
                        if (err) {
                            packet.error = err;
                        } else {
                            user.token = jwt.sign({
                                data: user.id
                            }, JWTSecret, {
                                expiresIn: '24h',
                            });
                            packet.first = user.token;
                            let connection = await connect;
                            if (!connection || connection instanceof Connection && !connection.isConnected) {
                                log.error('typeorm', 'DBConnection error');
                                packet.error = 'Internal error';
                            } else {
                                let userRepository = connection.getRepository(User);
                                userRepository.save(user);
                            }
                        }
                    });
                }
            }
            res.json(packet);
        }
    }
}