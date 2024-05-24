import ZoneRepository from './ZoneRepository.js';
import logger from '../../logger.js';
import mongoose from 'mongoose';
import Room from './Room.js'

class ZoneManager {
    constructor() {
        this.zones = new Map();  
        this.zoneRepository = new ZoneRepository(); 
    };
  
    // async createRoomInZoneId (roomData,zoneId) {
    //     try {
    //         const roomId = new mongoose.Types.ObjectId(); 
    //         const room = new Room({ ...roomData, _id: roomId });
    //         logger.info(`zoneManager created a Room object for ${room.name}`);
    //         const zone = await this.zones.getZoneById(zoneId);
    //         logger.info(`zoneManager got zone ${zone.name} from zones.`)
    //         if (zone && room) {
    //             zone.rooms.set(room._id, room);
    //             logger.info(`zoneManager added ${room.name} to ${zone.name}.`)
    //             return await zone.save();
    //         } else {
    //             logger.info(`zoneManager couldn't add ${roomData.name} to zoneId ${zoneId}.`);
    //             return null;
    //         }
    //     } catch(err) {
    //         logger.error(`createRoomInZoneId encountered ${err}`)
    //         throw(err);
    //     }
    // }

    async addZoneById(id) {
        try {
            const zone = await this.zoneRepository.retrieveZoneById(id);
            if (zone) {
                if (!this.zones.has(zone._id.toString())) {
                    this.zones.set(zone._id.toString(), zone);
                    logger.info(`zoneManager added ${zone.name} to zones.`);
                } else {
                    logger.warn(`Zone with id ${id} already exists in zones.`);
                }
                logger.info(`zones map: ${JSON.stringify(Array.from(this.zones))}`);
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
            logger.info(`zoneManager deleted zone with id ${id} from zones.`)
        } catch(err) {throw err};
    }
}

export default ZoneManager;
