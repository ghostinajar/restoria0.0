import UserManager from './UserManager.js';
import ZoneManager from './ZoneManager.js';
import logger from '../../logger.js';

class World {
    constructor() {
        this.userManager = new UserManager();
        this.zoneManager = new ZoneManager();
    }

}

export default World;