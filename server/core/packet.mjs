export default class Packet {
    constructor(
        handler,
        action
    ) {
        this.kind = `${process.env.service}#${handler}${action}Response`;
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