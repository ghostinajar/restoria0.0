import mongoose from 'mongoose';
import logger from '../../logger.js';
import Zone from './Zone.js';
import Item from './Item.js';
import Room from './Room.js';

class ZoneManager {
    constructor() {
        this.zones = new Map();  
    };
  
    async createItemInZoneId (item,zoneId) {
        try {
            const itemId = new mongoose.Types.ObjectId();
            item._id = itemId;
            const zone = await this.zones.get(zoneId.toString());
            logger.info(`zoneManager got zone ${zone.name} from zones.`)
            if (zone) {
                zone.items.set(item._id.toString(), item);
                logger.info(`zoneManager added ${item.name} to ${zone.name}. ${JSON.stringify(Array.from(zone.items))}`);
                return await zone.save();
            } else {
                logger.debug(`zoneManager couldn't add ${item.name} to zoneId ${zoneId}.`);
                return null;
            }
        } catch(err) {throw(err)}
    }

    async addZoneById(id) {
        try {
            const zone = await Zone.findById(id);
            if (zone) {
                if (!this.zones.has(zone._id.toString())) {
                    this.zones.set(zone._id.toString(), zone);
                    logger.info(`zoneManager added ${zone.name} to zones.`);
                } else {
                    logger.warn(`Zone with id ${id} already exists in zones.`);
                }
                logger.info(`Active zones: ${JSON.stringify(Array.from(this.zones.values()).map(zone => zone.name))}`);
                return zone;
            } else {
                logger.error(`zoneManager couldn't add zone with id ${id} to zones.`)
            }
        } catch(err) {throw err};
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
        } catch(err) {throw err;}
    }

    async removeZoneById(id) {
        try {
            this.zones.delete(id.toString());
            logger.info(`Active zones: ${JSON.stringify(Array.from(this.zones.values()).map(zone => zone.name))}`);
        } catch(err) {throw err};
    }
}

export default ZoneManager;
