import UserManager from './UserManager.js';
import ZoneManager from './ZoneManager.js';
import CharacterManager from './CharacterManager.js';
import { EventEmitter } from 'events';

class WorldEmitter extends EventEmitter {}

class World {
    constructor() {
        this.userManager = new UserManager();
        this.zoneManager = new ZoneManager();
        this.characterManager = new CharacterManager();
        this.worldEmitter = new WorldEmitter();
    }

    clearContents() {
        this.userManager = [];
        this.zoneManager = [];
        this.characterManager = [];
        this.worldEmitter.removeAllListeners();
        this.worldEmitter = null; 
    }
}

export default World;