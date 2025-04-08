import UserManager from './UserManager.js';
import ZoneManager from './ZoneManager.js';
import MobManager from './MobManager.js';
import worldEmitter, { WorldEmitter } from './WorldEmitter.js';
import Ticker from './Ticker.js';

class World {
    constructor() {
        this.userManager = new UserManager();
        this.zoneManager = new ZoneManager();
        this.mobManager = new MobManager();
        this.worldEmitter = worldEmitter;
        this.ticker = new Ticker();
    }

    userManager
    zoneManager
    mobManager
    worldEmitter : WorldEmitter
    ticker

    clearContents() {
        // TODO is there cleanup to do before nullifying userManager, zoneManager, mobManager?
        this.worldEmitter.removeAllListeners();
    }
}

export default World;