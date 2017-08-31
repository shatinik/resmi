import { Request, Response, NextFunction  } from 'express'
import Packet from './packet'
import log from './logger'

declare interface Action {
    (req: Request, res: Response, next: NextFunction, packet: Packet): void;
}

declare type ActionDecorator = (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<Action>) => TypedPropertyDescriptor<Action> | void;

export function authorized_only(): ActionDecorator {
    return function (object: any, methodName: string, descriptor: TypedPropertyDescriptor<Action>) {
        let action = descriptor.value;

        descriptor.value = async function(req: Request, res: Response, next: NextFunction, packet: Packet) {
            if (!req.user) {
                log.fatal('system', 'ATTENTION! Authenticate before calling room::add. Remove this message after enabling RBAC');
                packet.error = 'Not logged in';
                next(packet);
            } else {
                await action(req, res, next, packet);
            }
        };

        return descriptor;
    };
}