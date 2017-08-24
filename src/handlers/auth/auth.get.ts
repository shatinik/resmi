import Handler from '../../handler';
import * as Passport from 'passport'
import log from '../../logger'
import { Request, Response, NextFunction  } from 'express'

export class AuthGet extends Handler {
    vk(req: Request, res: Response, next: NextFunction) {
        Passport.authenticate('vkontakte')(req,res,next);
    }

    vkCallback(req: Request, res: Response, next: NextFunction) {
        Passport.authenticate('vkontakte', {
            successRedirect: '/test/login',
            failureRedirect: '/test/login'
        })(req,res,next)
    }

    facebook(req: Request, res: Response, next: NextFunction) {
        Passport.authenticate('facebook')(req,res,next);
    }

    facebookCallback(req: Request, res: Response, next: NextFunction) {
        Passport.authenticate('facebook', {
            successRedirect: '/test/login',
            failureRedirect: '/test/login'
        })(req,res,next)
    }

    logout(req, res: Response, next: NextFunction) {
        req.logout();
        res.redirect('/');
    }
}