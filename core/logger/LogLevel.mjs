export class LogLevel {
  constructor(id, messageTemplate, textColor) {
    this._id = id || 0;
    this._textColor = textColor || 0;
    this._messageTemplate = messageTemplate;
  }

  get id() { return this._id }
  get textColor() { return this._textColor }
  get messageTemplate() { return this._messageTemplate }

  color(message) {
    return `\x1b[${this.textColor}m${message}\x1b[0m`
  }

  static getNextLevelID() {
    return LogLevel.levelsCount++;
  }

  static add(logLevelName, textColor) {
    let newLevel = new LogLevel(LogLevel.getNextLevelID(), `[${logLevelName.toUpperCase()}/%s] %s`, textColor);
    this.levels[newLevel.id] = newLevel;
  }

  static getByID(levelID) {
    if (this.levels[levelID]) {
      return this.levels[levelID]
    }
  }

}

LogLevel.levels = []
LogLevel.levelsCount = 0