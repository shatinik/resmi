import { Server } from './server';
import { Core } from './core';

let core: Core = new Core();
new Server(core.app, 1337);