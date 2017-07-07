import * as Express from 'express'

declare namespace Core {
  function start(port: number): void
}

export declare interface route {
  method: string,
  uri: string,
  handler: string,
  action: string
}