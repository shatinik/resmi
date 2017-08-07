import { Request, Response, NextFunction  } from 'express'

export class Application {
  before_action(req: Request, res: Response, next: NextFunction) { return true }

  constructor(req: Request, res: Response, next: NextFunction, action: string) {
    if (this.before_action(req, res, next)) {
      this[action](req, res, next);
    }
  }

  auth(req: Request, res: Response, next: NextFunction) {
    return Boolean(req.user);
  }
}