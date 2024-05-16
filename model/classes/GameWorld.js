import UserRepository from './UserRepository.js';

class GameWorld {
    constructor() {
        this.userInstances = new Map();  // Stores all zones by their unique ID
        this.userRepository = new UserRepository(); //data access layer
    }

    addZone(zone) {
        this.zones.set(zone.id, zone);
    }

    getZoneById(id) {
        return this.zones.get(id);
    }
}



