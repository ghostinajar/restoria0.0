import { EventEmitter } from 'events';

class WorldEmitter extends EventEmitter {}

const worldEmitter = new WorldEmitter();

export default worldEmitter;