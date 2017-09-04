import IPacket from './shared/packet'

export default class Packet<T> extends IPacket<T> {
    constructor(
        handler: string,
        action: string
    ) {
        super(`${process.env.service}#${handler}${action}Response`);
    }

    set first(item: T) {
        this.items = [item];
    }

    get first(): T {
        return this.items[0];
    }

    toJSON(): IPacket<T> {
        return {
            kind:  this.kind,
            items: this.items,
            error: this.error,
            token: this.token
        }
    }
}