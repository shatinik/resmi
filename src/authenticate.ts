import * as Passport from 'passport'
import * as Express from 'express'
import User from './models/mysql/User'
import connect from './mysql'
import log from './logger'
import { Connection } from 'typeorm';

const VKontakteStrategy = require('passport-vkontakte').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

enum SERVICE {
    VK,
    Facebook
}

export default class Authenticate {
    private static VkCallback(accessToken, refreshToken, params, profile, done) {
        connect.then(async connection => {
            if (!connection || connection instanceof Connection && !connection.isConnected) {
                log.error('typeorm', 'DBConnection error');
            } else {
                console.log(profile);
                let userRepository = connection.getRepository(User);
                let user: User = await userRepository.findOne({
                    service: SERVICE.VK,
                    service_uid: profile.id
                });
                console.log(user);
                if (!user) {
                    log.debug('auth', `No user with service ${SERVICE.VK.toString()}(id: ${SERVICE.VK} and service_uid ${profile.id})`);
                    user = new User();
                    user.service = SERVICE.VK;
                    user.service_uid = profile.id;
                    user.name = '';//profile.displayName;
                    user.email = `${profile.id}@vk.com`;
                    user.picture_cut_uri = profile.photos[1].value; // photo_100
                    user.picture_full_uri = profile.photos[2].value; // photo_200
                    await userRepository.save(user);
                    log.debug('auth', `Added new user (id=${user.id}, service=${SERVICE.VK}, service_uid=${user.service_uid})`);
                }
                done(null, user)
            }
        });
    }

    private static FacebookCallback(accessToken, refreshToken, params, profile, done) {
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
                    user.email = profile.emails[0].value;
                    user.picture_cut_uri = profile.photos[0].value;
                    user.picture_full_uri = profile.photos[0].value;
                    await userRepository.save(user);
                    log.debug('auth', `Added new user (id=${user.id}, service=${SERVICE.Facebook}, service_uid=${user.service_uid})`);
                }
                done(null, user)
            }
        });
    }

    private static serialize(user: User, done) {
        done(null, user.id);
    }

    private static deserialize(id: number, done) {
        connect.then(async connection => {
            if (!connection || connection instanceof Connection && !connection.isConnected) {
                log.error('typeorm', 'DBConnection error');
            } else {
                let userRepository = connection.getRepository(User);
                let user = await userRepository.find({id: id});
                if (!user) {
                    log.debug('auth', `No user with ID ${id} and service ${SERVICE.VK.toString()}(id: ${SERVICE.VK}`);
                } else {
                    done(null, user)
                }
            }
        });
    }

    public static init(app: Express.Application) {
        app.use(Passport.initialize());
        app.use(Passport.session());

        Passport.use(new VKontakteStrategy({
                clientID: 6044938,
                clientSecret: 'PIxsTUbnEn2WhVj3dqcw',
                callbackURL: "/auth/vk/callback",
                profileFields: ['photo_200', 'photo_100']
            },
            Authenticate.VkCallback
        ));
        Passport.use(new FacebookStrategy({
                clientID: 320501398380272,
                clientSecret: '52721c304bebcc5380ef47e4b2e28432',
                callbackURL: "/auth/facebook/callback",
                profileFields: ['id', 'displayName', 'photos', 'emails', 'name']
            },
            Authenticate.FacebookCallback
        ));
        Passport.serializeUser(Authenticate.serialize);
        Passport.deserializeUser(Authenticate.deserialize);
    }
}