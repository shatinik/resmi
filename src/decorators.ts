import { Request, Response, NextFunction  } from 'express'
import Packet from './packet'
import log from './logger'

export function authorized_only() {
    return function (object: any, methodName: string, descriptor: TypedPropertyDescriptor<Function>) {
        let action = descriptor.value;

        descriptor.value = async function(req, res: Response, next: NextFunction, packet: Packet) {
            if (req.user) {
                await action(req, res, next, packet);
            } else {
                log.fatal('system', 'ATTENTION! Authenticate before calling room::add. Remove this message after enabling RBAC');
                packet.error = 'Not logged in';
                next(packet);
            }
        };

        return descriptor;
    }
}