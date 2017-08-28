import * as Passport from 'passport'
import * as Express from 'express'
import User from './models/mysql/User'
import connect from './mysql'
import log from './logger'
import { Connection } from 'typeorm';
import * as jwt from 'jsonwebtoken'
import Packet from './packet';

export const JWTSecret = 'SAd23jvbfbaecieajwodjdewfcWDxD';

const VKontakteStrategy = require('passport-vkontakte').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');

enum SERVICE {
    VK,
    Facebook
}

export class JWTObject {
    exp: string;
    data: any;
    iat: string;
}

export default class Authenticate {
    private static VkCallback(accessToken, refreshToken, params, profile, done) {
        connect.then(async connection => {
            if (!connection || connection instanceof Connection && !connection.isConnected) {
                log.error('typeorm', 'DBConnection error');
            } else {
                let userRepository = connection.getRepository(User);
                let user: User = await userRepository.findOne({
                    service: SERVICE.VK,
                    service_uid: profile.id
                });
                if (!user) {
                    log.debug('auth', `No user with service ${SERVICE.VK.toString()}(id: ${SERVICE.VK} and service_uid ${profile.id})`);
                    user = new User();
                    user.service = SERVICE.VK;
                    user.service_uid = profile.id;
                    user.name = ''; //profile.displayName;
                    // user.email = `${profile.id}@vk.com`;
                    user.picture_cut_uri = profile.photos[1].value; // photo_100
                    user.picture_full_uri = profile.photos[2].value; // photo_200
                    user.created_at = (new Date()).toString();
                    await userRepository.save(user);
                    log.debug('auth', `Added new user (id=${user.id}, service=${SERVICE.VK}, service_uid=${user.service_uid})`);
                } else {
                    user.last_auth = (new Date()).toString();
                    await userRepository.save(user);
                }
                done(null, user)
            }
        });
    }

    private static FacebookCallback(accessToken, refreshToken, profile, done) {
        connect.then(async connection => {
            if (!connection || connection instanceof Connection && !connection.isConnected) {
                log.error('typeorm', 'DBConnection error');
            } else {
                let userRepository = connection.getRepository(User);
                let user: User = await userRepository.findOne({
                    service: SERVICE.Facebook,
                    service_uid: profile.id
                });
                if (!user) {
                    log.debug('auth', `No user with service ${SERVICE.Facebook.toString()}(id: ${SERVICE.Facebook} and service_uid ${profile.id})`);
                    user = new User();
                    user.service = SERVICE.Facebook;
                    user.service_uid = profile.id;
                    user.name = profile.displayName;
                    // user.email = profile.emails[0].value;
                    user.picture_cut_uri = profile.photos[0].value;
                    user.picture_full_uri = profile.photos[0].value;
                    user.created_at = (new Date()).toString();
                    await userRepository.save(user);
                    log.debug('auth', `Added new user (id=${user.id}, service=${SERVICE.Facebook}, service_uid=${user.service_uid})`);
                } else {
                    user.last_auth = (new Date()).toString();
                    await userRepository.save(user);
                }
                done(null, user)
            }
        });
    }

    private static serialize(user: User, done) {
        done(null, user.id);
    }

    public static async deserialize(id: number) {
        let connection = await connect;
        if (!connection || connection instanceof Connection && !connection.isConnected) {
            log.error('typeorm', 'DBConnection error');
        } else {
            let userRepository = connection.getRepository(User);
            let user: User = await userRepository.findOneById(id);
            if (!user) {
                log.debug('auth', `No user with ID ${id} and service ${SERVICE.VK.toString()}(id: ${SERVICE.VK}`);
            } else {
                ////////
                // -> LAST ACTIVITY TIME
                // UPDATES AT EVERY API CALL
                // user.last_auth = (new Date()).toString();
                // await userRepository.save(user);
                ////////
                return user;
            }
        }
    }

    public static async checkLogin(req, JWT) {
        req.user = undefined;
        if (JWT) {
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
                                    if (!user) {
                                        log.warn('auth', 'Wrong token accepted. User deleted or token is fake(secret key had been stolen?)')
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
    }

    // private static deserialize(id: number, done) {
    //     connect.then(async connection => {
    //         if (!connection || connection instanceof Connection && !connection.isConnected) {
    //             log.error('typeorm', 'DBConnection error');
    //         } else {
    //             let userRepository = connection.getRepository(User);
    //             let user: User = await userRepository.findOneById(id);
    //             if (!user) {
    //                 log.debug('auth', `No user with ID ${id} and service ${SERVICE.VK.toString()}(id: ${SERVICE.VK}`);
    //             } else {
    //                 ////////
    //                 // -> LAST ACTIVITY TIME
    //                 // UPDATES AT EVERY API CALL
    //                 // user.last_auth = (new Date()).toString();
    //                 // await userRepository.save(user);
    //                 ////////
    //                 done(null, user)
    //             }
    //         }
    //     });
    // }

    public static init(app: Express.Application) {
        app.use(Passport.initialize());
        app.use(async (req, res, next) => {
            let authorization: string = req.header('Authorization');
            if (authorization) {
                let type: string;
                let token: string;
                [type, token] = authorization.split(' ');
                if (type == 'JWT') {
                    await Authenticate.checkLogin(req, token);
                }
            }
            next();
        });

        // app.use(Passport.session());
        Passport.serializeUser(Authenticate.serialize);
        // Passport.deserializeUser(Authenticate.deserialize);

        Passport.use(new VKontakteStrategy({
                clientID: 6044938,
                clientSecret: 'PIxsTUbnEn2WhVj3dqcw',
                callbackURL: "/auth/vk/callback",
                profileFields: ['photo_200', 'photo_100']
            },
            Authenticate.VkCallback
        ));
        Passport.use(new FacebookTokenStrategy({
                clientID: 320501398380272,
                clientSecret: '52721c304bebcc5380ef47e4b2e28432',
                profileFields: ['id', 'displayName', 'photos', 'emails', 'name']
            },
            Authenticate.FacebookCallback
        ));
    }
}