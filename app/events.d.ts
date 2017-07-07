export declare namespace Events {
  export function before(req: () => void, res: () => void, next: () => void): void;
  export function after(req: () => void, res: () => void, next: () => void): void;
  export function accessDenied(req: () => void, res: () => void, next: () => void): void;
}