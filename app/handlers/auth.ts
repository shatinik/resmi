import { Application } from '../application'
import * as Passport from 'passport'
import { Logger as log } from '../../resmi/logger'
import { Request, Response, NextFunction  } from 'express'

export class authHandler extends Application {
  vk(req: Request, res: Response, next: NextFunction) {
    Passport.authenticate('vkontakte')(req,res,next);
  }

  vkCallback(req: Request, res: Response, next: NextFunction) {
    Passport.authenticate('vkontakte', {
      successRedirect: '/',
      failureRedirect: '/login'
    })(req,res,next)
  }

  facebook(req: Request, res: Response, next: NextFunction) {
    Passport.authenticate('facebook')(req,res,next);
  }

  facebookCallback(req: Request, res: Response, next: NextFunction) {
    Passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/login'
    })(req,res,next)
  }

  logout(req: Request, res: Response, next: NextFunction) {
    req.logout();
    res.redirect('/');
  }
}