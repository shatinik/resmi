export class LogLevel {
  private _id: number = 0;
  private _textColor: number;
  private _messageTemplate: string;

  private static levels: LogLevel[] = [];
  private static levelsCount: number = 0;

  constructor(id: number, messageTemplate: string, textColor?: number) {
    this._id = id;
    this._textColor = textColor || 0;
    this._messageTemplate = messageTemplate;
  }

  get id(): number { return this._id }
  get textColor(): number { return this._textColor }
  get messageTemplate(): string { return this._messageTemplate }

  public color(message: string) {
    return `\x1b[${this.textColor}m${message}\x1b[0m`
  }

  private static getNextLevelID(): number {
    return LogLevel.levelsCount++;
  }

  public static add(logLevelName: string, textColor?: number): void {
    let newLevel: LogLevel = new LogLevel(LogLevel.getNextLevelID(), `[${logLevelName.toUpperCase()}/%s] %s`, textColor);
    this.levels[newLevel.id] = newLevel;
  }

  public static getByID(levelID: number): LogLevel | undefined {
    if (this.levels[levelID]) {
      return this.levels[levelID]
    }
  }

}