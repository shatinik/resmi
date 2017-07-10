import { Writer } from './Writer'
import { LogLevel } from './LogLevel'
import { safeLogger as log } from './'

const listeners: IListener[] = require(`../../configs/${process.env.NODE_ENV}/listeners`);

export interface IListener {
  level: number;
  writers: string[];
}

export class Listener {
  private _name: string;
  private _level: number;
  private _writers: Writer[];
  private errors: boolean;

  private static listeners: Listener[] = [];

  get level(): number { return this._level }
  get name(): string { return this._name }
  get writers(): Writer[] { return this._writers }
  get file(): string { return `${this.name.toLowerCase()}-${new Date().toLocaleDateString()}.log` }

  constructor(hash: IListener, name: string, errors: boolean) {
    this.errors = errors;
    this._name = name;
    this._level = hash.level;
    this._writers = [];
    for (let i = 0, j = 0; i < hash.writers.length; i++, j++) {
      if (!(this.writers[j] = Writer.getByName(hash.writers[i], errors))) {
        log.warn('logger', `Undefined writer '${this.writers[i]}'on listener ${this.name}`);
        j--;
      }
    }
  }

  public static getByName(listenerName: string, errors: boolean): Listener | undefined {
    if (!this.listeners[listenerName]) {
      if (!listeners[listenerName]) {
        if (errors) {
          log.error('logger', `Undefined listener '${listenerName}'`);
          return;
        }
      }
      this.listeners[listenerName] = new Listener(listeners[listenerName], listenerName, errors);
    }
    return this.listeners[listenerName];
  }

  acceptMessage(level: LogLevel, message: string): void {
    for (let i = 0; i < this.writers.length; i++) {
      this.writers[i].write(level, message, this);
    }
  }
}