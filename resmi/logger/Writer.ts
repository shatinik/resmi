import { LogLevel } from './LogLevel'
import { Listener } from './Listener'
import { safeLogger as log } from './'
import * as fs from 'fs'

const writers: IWriter[] = require(`../../configs/${process.env.NODE_ENV}/writers`);

export interface IWriter {
  level: number;
  type: number;
}

export class Writer {
  private _name: string;
  private _level: number;
  private _type: number;
  private errors: boolean;

  private static writers: Writer[] = [];

  get name(): string { return this._name }
  get level(): number { return this._level }
  get type(): number { return this._type }

  constructor(hash: IWriter, name: string, errors: boolean) {
    this.errors = errors;
    this._name = name;
    this._level = hash.level;
    this._type = hash.type;
  }

  public write(level: LogLevel, message: string, listener: Listener): void {
    if (level.id >= this.level) {
      switch (this.type) {
        case 1: // console
          message = level.color(message);
          Writer.writeConsole(message);
          break;
        case 2: // db
          this.writeDB(message);
          break;
        case 3: // file
          this.writeFile(message, listener.file);
          break;
        default:
          if (this.errors) {
            log.error('logger', `Unknown writer.level in 'writers[${this.name}]'`)
          }
      }
    }
  }

  private static writeConsole(message: string): void {
    console.log(message);
  }

  private writeFile(message: string, file: string): void {
    let prefix = new Date().toLocaleString().replace(/T/, ' ').replace(/\..+/, '').toString() + ' ';
    let postfix = '\r\n';

    fs.appendFile('logs/' + file, prefix + message + postfix, function (err) {
      if (err) {
        if (this.errors) {
          log.error("logger", err);
        }
        return;
      }
      if (this.errors) {
        log.trace('logger', `Line added into file '${file}'`);
      }
    });
  }

  private writeDB(message): void {
    // CODE HERE
  }

  public static getByName(listenerName: string, errors: boolean): Writer | undefined {
    if (!this.writers[listenerName]) {
      if (!writers[listenerName]) {
        if (errors) {
          log.error('logger', `Undefined writer '${listenerName}'`);
          return;
        }
      }
      this.writers[listenerName] = new Writer(writers[listenerName], listenerName, errors);
    }
    return this.writers[listenerName];
  }
}