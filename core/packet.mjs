export default class Packet {
    constructor(
        handler,
        action
    ) {
        super();
        this.kind = `${process.env.service}#${handler}${action}Response`;
    }

    set first(item) {
        this.items = [item];
    }

    get first() {
        return this.items[0];
    }

    toJSON() {
        return {
            kind:  this.kind,
            items: this.items,
            error: this.error,
            token: this.token
        }
    }
}