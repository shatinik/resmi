import Handler from '../../handler'
import { Request, Response, NextFunction  } from 'express'

export class VideoGet extends Handler {
    public getById(req, res: Response, next: NextFunction): void {}
    public getAllByPlaylistId(req, res: Response, next: NextFunction): void {}
}