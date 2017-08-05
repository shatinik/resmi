import * as Passport from 'passport'
import * as Express from 'express'
import { User } from '../entity/User'
import { connect } from '../database/typeorm'
import { Logger as log } from '../logger'
import { Connection } from 'typeorm';

const VKontakteStrategy = require('passport-vkontakte').Strategy;

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

    Passport.use(new VKontakteStrategy(
      {
        clientID: 6044938, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
        clientSecret: 'PIxsTUbnEn2WhVj3dqcw',
        callbackURL: "http://localhost:1337/auth/vkontakte/callback",
        lang: 'ru'
      },
      function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {

        // Now that we have user's `profile` as seen by VK, we can
        // use it to find corresponding database records on our side.
        // Also we have user's `params` that contains email address (if set in
        // scope), token lifetime, etc.
        // Here, we have a hypothetical `User` class which does what it says.
        connect.then(async connection => {
          if (connection instanceof Connection && connection.isConnected) {
            let userRepository = connection.getRepository(User);
            let currentUser = await userRepository.find({id: profile.id, service: SERVICE.VK});
            if (!currentUser) {
              log.debug('auth', `No user with ID ${profile.id} and service ${SERVICE.VK.toString()}(id: ${SERVICE.VK}`)
              return
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
          log.error('auth/db', 'DBConnection error');
        }
      });
    });
  }
}