import Handler from '../../handler';
import * as Passport from 'passport'
import log from '../../logger'
import { Request, Response, NextFunction  } from 'express'
import Packet from '../../packet'

export class AuthGet extends Handler {


    vkCallback(req: Request, res: Response, next: NextFunction, packet: Packet) {
        Passport.authenticate('vkontakte', (err, user, info) => {
            if (err) {
                packet.error = err;
            } else {
                if (!user) {
                    packet.error = 'Login error';
                } else {
                    req.logIn(user, err => {
                        if (err) {
                            packet.error = err;
                        } else {
                            packet.first = 'Ok';
                        }
                    });
                }
            }
            res.json(packet);
        })(req,res,next)
    }

    facebookCallback(req: Request, res: Response, next: NextFunction, packet: Packet) {
        Passport.authenticate('facebook', (err, user, info) => {
            if (err) {
                packet.error = err;
            } else {
                if (!user) {
                    packet.error = 'Login error';
                } else {
                    req.logIn(user, err => {
                        if (err) {
                            packet.error = err;
                        } else {
                            packet.first = 'Ok';
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
    
    logout(req, res: Response, next: NextFunction) {
        req.logout();
        res.redirect('/');
    }
}