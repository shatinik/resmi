import Handler from '../../handler'
import { Request, Response, NextFunction  } from 'express'

export class PlaylistGet extends Handler {
    public getById(req, res: Response, next: NextFunction): void {}
    public getAllByRoomId(req, res: Response, next: NextFunction): void {}
}