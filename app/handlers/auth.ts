import * as Passport from 'passport'
import { Logger as log } from '../../resmi/logger'
import { Request, Response, NextFunction  } from 'express'

export namespace authHandler {
  export function vk(req: Request, res: Response, next: NextFunction) {
    Passport.authenticate('vkontakte');
    // res.redirect('/');
  }

  export function vkCallback(req: Request, res: Response, next: NextFunction) {
    Passport.authenticate('vkontakte', { failureRedirect: '/login' });
    // res.redirect('/');
  }

  export function logout(req: Request, res: Response, next: NextFunction) {
    req.logout();
    res.redirect('/');
  }
}