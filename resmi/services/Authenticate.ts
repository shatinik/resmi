import * as Passport from 'passport'
import * as Express from 'express'
import { User } from '../entity/User'
import { connect } from '../database/typeorm'
import { Logger as log } from '../logger'
import { Connection } from 'typeorm';

const VKontakteStrategy = require('passport-vkontakte').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

enum SERVICE {
  VK,
  FB
}

export class Authenticate {
  constructor(app: Express.Application) {
    app.use(require('morgan')('combined'));
    app.use(require('cookie-parser')());
    app.use(require('body-parser').urlencoded({ extended: true }));
    app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
    app.use(Passport.initialize());
    app.use(Passport.session());

    Passport.use(new VKontakteStrategy({
        clientID: 6044938, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
        clientSecret: 'PIxsTUbnEn2WhVj3dqcw',
        callbackURL: "/auth/vk/callback",
        lang: 'ru'
      },
      function(accessToken, refreshToken, params, profile, done) {
        connect.then(async connection => {
          if (connection instanceof Connection && connection.isConnected) {
            let userRepository = connection.getRepository(User);
            let currentUser: User = await userRepository.findOne({service_uid: profile.id, service: SERVICE.VK});
            if (!currentUser) {
              log.debug('auth', `No user with service ${SERVICE.VK.toString()}(id: ${SERVICE.VK} and service_uid ${profile.id}`);
              currentUser = new User();
              currentUser.service = SERVICE.VK;
              currentUser.service_uid = profile.id;
              userRepository.save(currentUser).then(user => {
                log.debug('auth', `Added new user (id=${currentUser.id}, service=${SERVICE.VK}, service_uid=${currentUser.service_uid}`);
                done(null, currentUser)
              });
              return;
            }
            done(null, currentUser)
          }  else {
            log.error('auth/db', 'DBConnection error');
          }
        });
      }
    ));

    Passport.use(new FacebookStrategy({
        clientID: 320501398380272,
        clientSecret: '52721c304bebcc5380ef47e4b2e28432',
        callbackURL: "/auth/facebook/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        connect.then(async connection => {
          if (connection instanceof Connection && connection.isConnected) {
            let userRepository = connection.getRepository(User);
            let currentUser: User = await userRepository.findOne({service_uid: profile.id, service: SERVICE.FB});
            if (!currentUser) {
              log.debug('auth', `No user with service ${SERVICE.VK.toString()}(id: ${SERVICE.FB} and service_uid ${profile.id}`);
              currentUser = new User();
              console.log(profile);
              currentUser.service = SERVICE.FB;
              currentUser.service_uid = profile.id;
              userRepository.save(currentUser).then(user => {
                log.debug('auth', `Added new user (id=${currentUser.id}, service=${SERVICE.FB}, service_uid=${currentUser.service_uid}`);
                done(null, currentUser)
              });
              return;
            }
            done(null, currentUser)
          }  else {
            log.error('auth/db', 'DBConnection error');
          }
        });
      }
    ));

    // User session support for our hypothetical `user` objects.
    Passport.serializeUser(function (user: User, done) {
      done(null, user.id);
    });

    Passport.deserializeUser(function (id: number, done) {
      connect.then(async connection => {
        if (connection instanceof Connection && connection.isConnected) {
          let userRepository = connection.getRepository(User);
          let currentUser = await userRepository.find({id: id});
          if (!currentUser) {
            log.debug('auth', `No user with ID ${id} and service ${SERVICE.VK.toString()}(id: ${SERVICE.VK}`)
            return
          }
          done(null, currentUser)
        }  else {
          log.error('auth', 'DBConnection error');
        }
      });
    });
  }
}