class GameWorld {
    constructor() {
        this.zones = new Map();  // Stores all zones by their unique ID
    }

    addZone(zone) {
        this.zones.set(zone.id, zone);
    }

    getZoneById(id) {
        return this.zones.get(id);
    }
}



