import Handler from '../../core/handler';
import User from '../../models/mysql/User'
import log from '../../core/logger'
import Packet from '../../core/packet'
import Authenticate from '../../core/authenticate';
import { JWTSecret} from '../../core/authenticate';
import jwt from 'jsonwebtoken'
import connect from '../../core/mysql'
import newUser from '../../models/mongo/User'

export class TestGet extends Handler {
    async testDB(req, res, next, packet) {
        try {
            newUser.findOne((error, result) => {
                packet.first = result.getID();
                next(packet);
            })
        }
        catch(e) {
            next(packet);
        }
    }

    login(req, res, next, packet){
        if (!req.user) {
            packet.first = 'You are not logged in';
        } else {
            let user = req.user;
            packet.first = `You are logged in (id=${user.id}, service=${user.service}, service_uid=${user.service_uid})`;
        }
        next(packet);
    }

    async webtoken(req, res, next, packet) {
        let JWT = req.query.JWT; // req.header('JWT');
        if (!JWT) {
            packet.error = 'Blank JWT'
        } else {
            try {
                let payload = jwt.verify(JWT, JWTSecret);
                if (typeof payload === 'string') {
                    log.error('auth', payload);
                } else {
                    let token = payload;
                    let id = token.data;
                    req.user = await Authenticate.deserialize(id);
                }
            } catch (e) {
                try {
                    let payload = jwt.verify(JWT, JWTSecret, { ignoreExpiration: true });
                if (typeof payload === 'string') {
                    log.error('auth', payload);
                } else {
                    let token = payload;
                    let id = token.data;
                    let user = await User.findOne({ token: JWT });
                    if (!user) {
                        user = await User.findOneById(id);
                        console.log(id);
                        if (!user) {
                            log.warn('auth', 'Wrong token accepted. User deleted or it is fake token(secret key had been stolen?)')
                        } else {
                            log.warn('auth', 'Wrong token accepted. It is old or fake(secret key had been stolen?)')
                            // Старым он может быть только в случае, если в базе хранится только токен для одной последней сессии. Иначе - однозначно фейк
                        }
                    } else {
                        user.token = req.new_token = jwt.sign({ data: user.id }, JWTSecret, { expiresIn: '24h' });
                        log.debug('auth', `New token generated for user ${user.id}`);
                        await userRepository.save(user);
                        req.user = user;
                    }
                }
                } catch (e) {
                    log.error('auth', e);
                }
                
            }
        }
        this.login(req, res, next, packet);
    }
}