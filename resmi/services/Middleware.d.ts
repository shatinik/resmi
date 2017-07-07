export declare interface Middleware {
  construct(req: () => void, res: () => void, next?: () => void, ...args): void
}