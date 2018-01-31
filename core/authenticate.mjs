import Passport from 'passport'
import Express from 'express'
import User from '../models/mongo/User'
import connect from './mysql'
import log from './logger'
import * as jwt from 'jsonwebtoken'
import Packet from './packet';

export const JWTSecret = 'SAd23jvbfbaecieajwodjdewfcWDxD';

import _VKontakteStrategy from 'passport-vkontakte';
import VKontakteTokenStrategy from 'passport-vkontakte-token';
import FacebookTokenStrategy  from 'passport-facebook-token';
let VKontakteStrategy = _VKontakteStrategy.Strategy;
const SERVICE = {
    VK: 0,
    FACEBOOK: 1
}
export default class Authenticate {
    static async VkCallback(accessToken, refreshToken, params, profile, done) {
        let user = await User.findOne({
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
            await user.save();
            log.debug('auth', `Added new user (id=${user.id}, service=${SERVICE.VK}, service_uid=${user.service_uid})`);
        } else {
            user.last_auth = (new Date()).toString();
            await user.save();
        }
        done(null, user)
    }

    static async FacebookCallback(accessToken, refreshToken, profile, done) {
        let user = await User.findOne({
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
            await user.save();
            log.debug('auth', `Added new user (id=${user.id}, service=${SERVICE.Facebook}, service_uid=${user.service_uid})`);
        } else {
            user.last_auth = (new Date()).toString();
            await user.save();
        }
        done(null, user)
    }

    static serialize(user, done) {
        done(null, user._id);
    }

    static async deserialize(id) {
        let user = await User.findOne({_id: id});
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

    static async checkLogin(req, JWT) {
        console.log(1);
        req.user = undefined;
        if (JWT) {
            try {
                let payload = jwt.verify(JWT, JWTSecret);
                if (typeof payload === 'string') {
                    log.error('auth', payload);
                } else {
                    let token = payload;
                    let id = Number(token.data);
                    if (isNaN(id)) {
                        log.error('auth', `Wrong data written to JWT ${token} when number expected`);
                    } else {
                        req.user = await Authenticate.deserialize(id);
                    }
                }
            } catch (e) {
                if (e instanceof jwt.TokenExpiredError) {
                    let connection = await connect;
                    if (!connection || !connection.isConnected) {
                        log.error('typeorm', 'DBConnection error');
                    } else {
                        try {
                            let payload = jwt.verify(JWT, JWTSecret, {ignoreExpiration: true});
                            if (typeof payload === 'string') {
                                log.error('auth', payload);
                            } else {
                                let token = payload;
                                let id = Number(token.data);
                                let user = await User.findOne({token: JWT});
                                if (!user) {
                                    user = await User.findOneById(id);
                                    if (!user) {
                                        log.warn('auth', 'Wrong token accepted. User deleted or token is fake(secret key had been stolen?)')
                                    } else {
                                        log.warn('auth', 'Wrong token accepted. It is old or fake(secret key had been stolen?)')
                                        // Старым он может быть только в случае, если в базе хранится только токен для одной последней сессии. Иначе - однозначно фейк
                                    }
                                } else {
                                    user.token = req.new_token = jwt.sign({ data: user.id }, JWTSecret, { expiresIn: '24h' });
                                    log.debug('auth', `New token generated for user ${user.id}`);
                                    await user.save();
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
    //         if (!connection || !connection.isConnected) {
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

    static init(app) {
        app.use(Passport.initialize());
        app.use(async (req, res, next) => {
            let authorization = req.header('Authorization');
            if (authorization) {
                let type;
                let token;
                [type, token] = authorization.split(' ');
                if (type == 'JWT') {
                    await Authenticate.checkLogin(req, token);
                }
            }
            next();
        });

        //app.use(Passport.session());
        Passport.serializeUser(Authenticate.serialize);
        //Passport.deserializeUser(Authenticate.deserialize);

        Passport.use(new VKontakteStrategy({
                clientID: 6044938,
                clientSecret: 'PIxsTUbnEn2WhVj3dqcw',
                callbackURL: "/auth/vk/callback",
                profileFields: ['photo_200', 'photo_100']
            },
            Authenticate.VkCallback
        ));
        Passport.use(new VKontakteTokenStrategy({
                clientID: 6044938,
                clientSecret: 'PIxsTUbnEn2WhVj3dqcw',
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