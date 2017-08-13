import Handler from '../../handler';
import { Request, Response, NextFunction  } from 'express'
import connect from '../../mysql'
import { Connection } from 'typeorm';
import Room from '../../models/mysql/Room';
import log from '../../logger'
import Packet from '../../packet';

export class RoomPut extends Handler {

    public editById(req: Request, res: Response, next: NextFunction): void {
        /*
            Обновление информации о комнате по её Id
        */

    }
}