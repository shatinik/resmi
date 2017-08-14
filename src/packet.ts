class ResponseTemplate {
    kind: string;
    item: any;
    items: any[];
    error?: string;
}

export default class Packet {
    private _items: any[];

    private handler: string;
    private action: string;
    private _error: string;

    constructor(handler: string, action: string) {
        this.handler = handler;
        this.action = action;
    }

    get error(): string {
        return this._error;
    }

    set error(text: string) {
        this._error = text;
    }

    get items(): any[] {
        return this._items;
    }

    set items(items: any[]) {
        this._items = items;
    }

    set first(item: any) {
        this._items = [item];
    }

    get first(): any {
        return this._items[0];
    }

    get isEmpty(): boolean {
        return !Boolean(this._items);
    }

    toJSON(): object {
        let res: ResponseTemplate = new ResponseTemplate();
        res.kind = `${process.env.service}#${this.handler}${this.action}Response`;
        if (!this.isEmpty) {
            res.items = this.items;
        }
        if (this.error) {
            res.error = this.error;
        } else {
            res.error = undefined;
        }
        return res;
    }
}