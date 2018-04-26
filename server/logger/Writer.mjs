import { LogLevel } from './LogLevel'
import { Listener } from './Listener'
import { safeLogger as log } from './'
import fs from 'fs'

import writers from '../../configs/development/writers';

export class Writer {
  get name() { return this._name }
  get level() { return this._level }
  get type() { return this._type }

  constructor(hash, name, errors) {
    this.errors = errors;
    this._name = name;
    this._level = hash.level;
    this._type = hash.type;
  }

  write(level, message, listener) {
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

  static writeConsole(message) {
    console.log(message);
  }

  writeFile(message, file) {
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

  writeDB(message) {
    // CODE HERE
  }

  static getByName(listenerName, errors) {
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

Writer.writers = [];