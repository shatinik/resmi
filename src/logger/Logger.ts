import * as util from 'util';
import * as fs from 'fs'
import { Listener } from './Listener'
import { LogLevel } from './LogLevel'
import ErrnoException = NodeJS.ErrnoException;

export default class Logger {
  private static _instance: Logger;
  private static _safeinstance: Logger;
  private errors: boolean = true;

  static get instance(): Logger {
      if (!Logger._instance) {
          Logger._instance = new Logger();
      }
      return Logger._instance;
  }

  static get safe(): Logger {
    if (!Logger._safeinstance) {
      Logger._safeinstance = new Logger(false);
    }
    return Logger._safeinstance;
  }

  trace(listener: string, message: string) { this.process(listener, message, 0)}
  debug(listener: string, message: string) { this.process(listener, message, 1)}
  info(listener: string, message: string) { this.process(listener, message, 2)}
  warn(listener: string, message: string) { this.process(listener, message, 3)}
  error(listener: string, message: string | ErrnoException) { this.process(listener, message.toString(), 4)}
  fatal(listener: string, message: string) { this.process(listener, message, 5)}

  private constructor(errors?: boolean) {
    if (errors == false) {
      this.errors = false;
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
        this.info('logger', 'Created \'/logs\' folder');
      }
    }
  }

  private process(listenerName: string, _message: string, levelId: number) {
    let level: LogLevel = LogLevel.getByID(levelId);
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

  private static preprocessMessage(level: LogLevel, ...args: string[]) {
    let message: string = level.messageTemplate;
    for (let i = 0; i < args.length; i++) {
      message = util.format(message, args[i]);
    }
    return message;
  }
}