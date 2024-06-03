import UserManager from './UserManager.js';
import ZoneManager from './ZoneManager.js';
import ItemManager from './ItemManager.js';
import worldEmitter from './WorldEmitter.js';

class World {
    constructor() {
        this.userManager = new UserManager();
        this.zoneManager = new ZoneManager();
        this.ItemManager = new ItemManager();
        this.worldEmitter = worldEmitter;
    }

    clearContents() {
        this.userManager = [];
        this.zoneManager = [];
        this.ItemManager = [];
        this.worldEmitter.removeAllListeners();
        this.worldEmitter = null; 
    }
}

export default World;