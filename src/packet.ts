interface IPacket<T> {
    kind: string
    items: T[]
    error?: string
    token?: string
}

export default class Packet<T> implements IPacket<T> {
    public kind: string;
    public items: T[] = [];
    public error: string;
    public token: string;

    constructor(
        private handler: string,
        private action: string
    ) {
        this.kind = `${process.env.service}#${this.handler}${this.action}Response`;
    }

    set first(item: T) {
        this.items = [item];
    }

    get first(): T {
        return this.items[0];
    }

    toJSON(): IPacket<T> {
        return {
            kind: this.kind,
            items: this.items,
            error: this.error,
            token: this.token
        }
    }
}