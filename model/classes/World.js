import UserManager from './UserManager.js';
import ZoneManager from './ZoneManager.js';
import CharacterManager from './CharacterManager.js';
import logger from '../../logger.js';

class World {
    constructor() {
        this.userManager = new UserManager();
        this.zoneManager = new ZoneManager();
        this.characterManager = new CharacterManager();
    }

    clearContents() {
        this.userManager = [];
        this.zoneManager = [];
        this.characterManager = [];
    }
}

export default World;