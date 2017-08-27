import Handler from '../../handler';
import * as Passport from 'passport'
import log from '../../logger'
import { Request, Response, NextFunction  } from 'express'
import Packet from '../../packet'
import * as jwt from 'jsonwebtoken'
import { JWTSecret } from '../../authenticate';

export class AuthGet extends Handler {
    currentUser(req, res: Response, next: NextFunction, packet: Packet) {
        if (!req.user) {
            packet.error = 'You are not logged in';
        } else {
            packet.first = req.user;
        }
        next(packet);
    }

    vkCallback(req: Request, res: Response, next: NextFunction, packet: Packet) {
        Passport.authenticate('vkontakte', { session: false },(err, user, info) => {
            if (err) {
                packet.error = err;
            } else {
                if (!user) {
                    packet.error = 'Unknown error';
                } else {
                    req.logIn(user, err => {
                        if (err) {
                            packet.error = err;
                        } else {
                            packet.first = jwt.sign({
                                data: user.id
                            }, JWTSecret, {
                                expiresIn: '1h',
                            });
                        }
                    });
                }
            }
            res.json(packet);
        })(req,res,next)
    }

    facebookCallback(req: Request, res: Response, next: NextFunction, packet: Packet) {
        Passport.authenticate('facebook', { session: false },(err, user, info) => {
            if (err) {
                packet.error = err;
            } else {
                if (!user) {
                    packet.error = 'Unknown error';
                } else {
                    req.logIn(user, err => {
                        if (err) {
                            packet.error = err;
                        } else {
                            packet.first = jwt.sign({
                                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                                data: user.id
                            }, JWTSecret);
                        }
                    });
                }
            }
            res.json(packet);
        })(req,res,next)
    }


    vk(req: Request, res: Response, next: NextFunction) {
        Passport.authenticate('vkontakte')(req,res,next);
    }

    facebook(req: Request, res: Response, next: NextFunction) {
        Passport.authenticate('facebook')(req,res,next);
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
}