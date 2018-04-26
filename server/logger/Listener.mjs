import { Writer } from './Writer'
import { LogLevel } from './LogLevel'
import { safeLogger as log } from './'

import listeners from '../../configs/development/listeners';

export class Listener {
  get level() { return this._level }
  get name() { return this._name }
  get writers() { return this._writers }
  get file() { return `${this.name.toLowerCase()}-${new Date().toLocaleDateString()}.log` }

  constructor(hash, name, errors) {
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

  static getByName(listenerName, errors) {
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

  acceptMessage(level, message) {
    for (let i = 0; i < this.writers.length; i++) {
      this.writers[i].write(level, message, this);
    }
  }
}

Listener.listeners = [];
