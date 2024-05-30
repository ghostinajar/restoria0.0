import logger from '../../logger.js';
import Zone from './Zone.js';

class ZoneManager {
    constructor() {
        this.zones = new Map();
    };

    async addZoneById(id) {
        try {
            const zone = await Zone.findById(id);
            //if zone exists and isn't already in zones map
            if (zone && !this.zones.has(zone._id.toString())) {  
                // add zone to zones map        
                this.zones.set(zone._id.toString(), zone);
                logger.info(`zoneManager added ${zone.name} to zones.`);
                logger.info(`Active zones: ${JSON.stringify(Array.from(this.zones.values()).map(zone => zone.name))}`);
                await zone.initRooms();
                return zone;
            } else {
                logger.error(`zoneManager couldn't add zone with id ${id} to zones.`)
                return zone;
            }
        } catch(err) {
            logger.error(`Error in addZoneById: ${err.message}`);
            throw err;
        };
    }

    async getZoneById(id) {
        try {
            const zone = this.zones.get(id.toString());
            if (zone) {
                return zone;
            } else {
                logger.info(`zoneManager can't find zone with id: ${id}.`);
                return null;
            };
        } catch(err) {
            logger.error(`Error in getZoneById: ${err.message}`);
            throw err;
        }
    }

    async removeZoneById(id) {
        try {
            const zone = this.zones.get(id.toString());
            if (zone) {
                zone.removeFromWorld()
                logger.info(`Removing zone "${zone.name}" from zones...`)
                this.zones.delete(id.toString());
                logger.info(`Active zones: ${JSON.stringify(Array.from(this.zones.values()).map(zone => zone.name))}`);
            } else {
                logger.warn(`Zone with id ${id} does not exist in zones.`);
            }
        } catch(err) {
            logger.error(`Error in removeZoneById: ${err.message}`);
            throw err;
        }
    }

    clearContents() {
        this.zones = [];
    }
    
}

export default ZoneManager;