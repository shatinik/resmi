declare interface CronEvent {
  title: string
  pattern: string
  start: boolean
  timeZone: string
  runs: () => void
  stops: () => void
  onComplete: () => void
}