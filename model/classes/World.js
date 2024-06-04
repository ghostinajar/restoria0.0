import UserManager from './UserManager.js';
import ZoneManager from './ZoneManager.js';
import ItemManager from './ItemManager.js';
import MobManager from './MobManager.js';
import worldEmitter from './WorldEmitter.js';

class World {
    constructor() {
        this.userManager = new UserManager();
        this.zoneManager = new ZoneManager();
        this.itemManager = new ItemManager();
        this.mobManager = new MobManager();
        this.worldEmitter = worldEmitter;
    }

    clearContents() {
        // TODO is there cleanup to do before emptying these arrays?
        this.userManager = [];
        this.zoneManager = [];
        this.itemManager = [];
        this.mobManager = []
        this.worldEmitter.removeAllListeners();
        this.worldEmitter = null; 
    }
}

export default World;