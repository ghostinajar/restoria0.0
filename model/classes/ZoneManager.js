import ZoneRepository from './ZoneRepository.js';
import logger from '../../logger.js';
import mongoose from 'mongoose';

class ZoneManager {
    constructor() {
        this.zones = new Map();  // Stores all zones with their ObjectId as key
        this.zoneRepository = new ZoneRepository(); //data access layer
        //if (this.zoneRepository) {logger.info(`zoneRepository initialized!`)}
    };

    ensureIdIsObjectId(id) {
        if (typeof id === 'string') {
            id = new mongoose.Types.ObjectId(id);
        }
    }

    async addZoneById(id) {
        try {
            this.ensureIdIsObjectId(id);
            const zone = await this.zoneRepository.retrieveZone(id);
            if (zone) {
                logger.info(`zoneManager.zoneRepository retrieved ${zone.name}, id: ${zone._id}.`);
                this.zones.set(zone._id, zone);
                //logger.info(`zoneManager added ${zone.name} to zones.`);
                return zone;
            } else {
                logger.error(`zoneManager couldn't add zone with id ${id} to zones.`)
            }
        } catch(err) {throw err};
    }

    async getZoneById(id) {
        try {
            this.ensureIdIsObjectId(id);
            const zone = this.zones.get(id);
            if (zone) {
                //logger.info(`zoneManager got ${zone.name} from zones.`);
                return zone;
            } else {
                logger.info(`zoneManager can't find zone with id: ${id}.`);
                return null;
            };
        } catch(err) {throw err;}
    }

    async removeZoneById(id) {
        try {
            this.ensureIdIsObjectId(id);
            this.zones.delete(id);
            logger.info(`zoneManager deleted zone with id ${id} from zones.`)
        } catch(err) {throw err};
    }
}

export default ZoneManager;
