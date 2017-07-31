import { connect } from '../../resmi/database/typeorm'
import { Room } from '../entity/Room'

export namespace roomHandler {
    export function getInfo(req, res, next) {
      connect.then(async connection => {
        let roomRepository = connection.getRepository(Room);
        res.json({
          "kind": process.env.service + '#' + 'room' + 'getInfo' + 'Response',
          "items": await roomRepository.find()
        });
        next();
      })
    }
}