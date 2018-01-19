import Handler from '../../core/handler';
import * as Passport from 'passport'
import log from '../../core/logger'
import Packet from '../../core/packet'
import * as jwt from 'jsonwebtoken'
import { JWTSecret } from '../../core/authenticate';
import connect from '../../core/mysql'
import User from '../../models/mysql/User';
//import {authorized_only} from '../../decorators';


export class AuthGet extends Handler {
    //@authorized_only()
    currentUser(req, res, next, packet) {
        packet.first = req.user;
        next(packet);
    }

    check(req, res, next, packet) {
        packet.first = !!req.user;
        next(packet);
    }

    vkCallback(req, res, next, packet) {
        Passport.authenticate('vkontakte'/*-token*/, { session: false }, this.authCallback(req, res, next, packet))(req,res,next)
    }

    facebookCallback(req, res, next, packet) {
        Passport.authenticate('facebook-token', { session: false }, this.authCallback(req, res, next, packet))(req,res,next)
    }


    vk(req, res, next) {
        Passport.authenticate('vkontakte')(req,res,next);
    }

    logout(req, res, next, packet) {
        if (req.user) {
            req.logout();
            packet.first = 'Ok';
        } else {
            packet.error = 'You are not logged in';
        }
        next(packet);
    }

    authCallback(req, res, next, packet) {
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
                            if (!connection || !connection.isConnected) {
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