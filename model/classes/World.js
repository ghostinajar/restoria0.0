import UserManager from './UserManager.js';
import ZoneManager from './ZoneManager.js';
import worldEmitter from './WorldEmitter.js';

class World {
    constructor() {
        this.userManager = new UserManager();
        this.zoneManager = new ZoneManager();
        this.worldEmitter = worldEmitter;
    }

    clearContents() {
        this.userManager = [];
        this.zoneManager = [];
        this.worldEmitter.removeAllListeners();
        this.worldEmitter = null; 
    }
}

export default World;