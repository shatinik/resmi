declare interface writer{
  type: number,
  level: number
}

declare interface listener{
  level: number,
  writers: string[],
  file?: string
}