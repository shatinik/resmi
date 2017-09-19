class IPacket<T> {
    items: T[];
    error?: string;
    token?: string;
    kind: string;
}

export default class Packet<T> implements IPacket<T> {
    items: T[];
    error?: string;
    token?: string;
    kind: string;

    constructor(
        handler: string,
        action: string
    ) {
        this.kind = `${process.env.service}#${handler}${action}Response`;
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