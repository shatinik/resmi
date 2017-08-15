import Handler from '../../handler'
import { Request, Response, NextFunction  } from 'express'

export class VideoDelete extends Handler {
    public deleteById(req, res: Response, next: NextFunction): void {}
}