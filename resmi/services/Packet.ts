class ResponseTemplate {
  kind: string;
  items: object[];
  error?: string;
}

export class Packet {
  handler: string;
  action: string;
  items: object[];
  error: string;

  constructor(handler: string, action: string) {
    this.handler = handler;
    this.action = action;
  }

  toJSON(): object {
    let res: ResponseTemplate = new ResponseTemplate();
    res.kind = `${process.env.service}#${this.handler}${this.action}Response`;
    res.items = this.items;
    if (this.error) {
      res.error = this.error;
    } else {
      res.error = undefined;
    }
    return res;
  }
}