class ResponseTemplate<T> {
    kind: string;
    item: T;
    items: T[];
    token?: string;
    error?: string;
}

export default class Packet<T> {
    private _items: T[];

    private handler: string;
    private action: string;
    private _error: string;
    private _token: string;

    constructor(handler: string, action: string) {
        this.handler = handler;
        this.action = action;
    }

    get token(): string {
        return this._token;
    }

    set token(value: string) {
        this._token = value;
    }

    get error(): string {
        return this._error;
    }

    set error(text: string) {
        this._error = text;
    }

    get items(): T[] {
        return this._items;
    }

    set items(items: T[]) {
        this._items = items;
    }

    set first(item: T) {
        this._items = [item];
    }

    get first(): T {
        return this._items[0];
    }

    get isEmpty(): boolean {
        return !Boolean(this._items);
    }

    toJSON(): object {
        let res: ResponseTemplate<any> = new ResponseTemplate();
        res.kind = `${process.env.service}#${this.handler}${this.action}Response`;
        if (!this.isEmpty) {
            res.items = this.items;
        }
        if (this.error) {
            res.error = this.error;
        }
        if (this.token) {
            res.token = this.token;
        }
        return res;
    }
}