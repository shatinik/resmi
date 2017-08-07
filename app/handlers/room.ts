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

  add(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      log.fatal('system', 'ATTENTION! Authenticate before calling room::add. Remove this message after enabling RBAC');
      return;
    }
    connect.then(async connection => {
      let packet = new Packet('room', 'getInfo');
      if (req.query.title && req.query.urlAdress) {
        let title: string = req.query.title;
        let urlAdress: string = req.query.urlAdress;
        if (title && urlAdress) {
          if (connection instanceof Connection && connection.isConnected) {
            let roomRepository = connection.getRepository(Room);
            let room: Room = new Room();
            room.title = title;
            room.urlAdress = urlAdress;
            room.creatorId = req.user[0].id;
            roomRepository.save(room).then(room => {
              packet.first = 'Ok';
              res.json(packet);
              next();
            });
            return;
          } else {
            log.error('typeorm', 'DBConnection error');
            packet.error = 'Internal error';
          }
        } else {
          packet.error = 'ID is NaN';
        }
      } else {
        packet.error = 'Not enough data';
      }
      if (packet.error) {
        log.debug('net', packet.error);
      }
      res.json(packet);
      next();
    })
  }
}