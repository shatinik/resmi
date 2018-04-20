import util         from 'util';
import fs           from 'fs'
import { Listener } from './Listener'
import { LogLevel } from './LogLevel'

export default class Logger {

  trace ( message ) { this.process(this.listener, message, 0)}
  debug ( message ) { this.process(this.listener, message, 1)}
  info  ( message ) { this.process(this.listener, message, 2)}
  warn  ( message ) { this.process(this.listener, message, 3)}
  error ( message ) { this.process(this.listener, message.toString(), 4)}
  fatal ( message ) { this.process(this.listener, message, 5)}

  constructor(listener, errors) {

    this.listener = listener;  
    if (errors == false) {
      this.errors = false;
    } else {
      this.errors = true;
    }

    LogLevel.add('trace', 32);
    LogLevel.add('debug', 90);
    LogLevel.add('info', 37);
    LogLevel.add('warn', 33);
    LogLevel.add('error', 31);
    LogLevel.add('fatal', 35);
    if (!fs.existsSync('logs')) {
      fs.mkdirSync('logs');
      if (this.errors) {
        this.info('Created \'/logs\' folder');
      }
    }
  }

  process(listenerName, _message, levelId) {
    let level = LogLevel.getByID(levelId);
    let listener = Listener.getByName(listenerName, this.errors);
    if (listener) {
      let message = Logger.preprocessMessage(level, listener.name, _message);
      if (level.id >= listener.level) {
        listener.acceptMessage(level, message);
      }
    } else {
      // error listener not found
    }
  }

  static preprocessMessage(level, ...args) {
    let message = level.messageTemplate;
    for (let i = 0; i < args.length; i++) {
      message = util.format(message, args[i]);
    }
    return message;
  }
}