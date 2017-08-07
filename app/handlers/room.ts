import { connect } from '../../resmi/database/typeorm'
import { Room } from '../entity/Room'
import { Connection } from 'typeorm';
import { Packet } from '../../resmi/services/Packet';
import { Request, Response, NextFunction  } from 'express'
import { Logger as log } from '../../resmi/logger'
import {Application} from '../application';

export class roomHandler extends Application {
    getInfo(req: Request, res: Response, next: NextFunction) {
      connect.then(async connection => {
        let packet = new Packet('room', 'getInfo');
        if (req.query.id) {
          let id: number = Number(req.query.id);
          if (!isNaN(id)) {
            if (connection instanceof Connection && connection.isConnected) {
              let roomRepository = connection.getRepository(Room);
              packet.first = await roomRepository.findOneById(id);
              if (!packet.first) {
                packet.error = `No room with ID ${id}`;
              }
            } else {
              log.error('typeorm', 'DBConnection error');
              packet.error = 'Internal error';
            }
          } else {
            packet.error = 'ID is NaN';
          }
        } else {
          packet.error = 'ID is empty';
        }
        if (packet.error) {
          log.debug('net', packet.error);
        }
        res.json(packet);
        next();
      })
    }
}