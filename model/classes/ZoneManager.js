import ZoneRepository from './ZoneRepository.js';
import logger from '../../logger.js';
import mongoose from 'mongoose';
import Room from './Room.js'

class ZoneManager {
    constructor() {
        this.zones = new Map();  // Stores all zones with their ObjectId as key
        this.zoneRepository = new ZoneRepository(); //data access layer
        //if (this.zoneRepository) {logger.info(`zoneRepository initialized!`)}
    };
  
    async createRoomInZoneId (roomData,zoneId) {
        try {
            const roomId = new mongoose.Types.ObjectId(); 
            const room = new Room({ ...roomData, _id: roomId });
            logger.info(`zoneManager created a Room object for ${room.name}`);
            const zone = await this.zones.getZoneById(zoneId);
            logger.info(`zoneManager got zone ${zone.name} from zones.`)
            if (zone && room) {
                zone.rooms.set(room._id, room);
                logger.info(`zoneManager added ${room.name} to ${zone.name}.`)
                return await zone.save();
            } else {
                logger.info(`zoneManager couldn't add ${roomData.name} to zoneId ${zoneId}.`);
                return null;
            }
        } catch(err) {
            logger.error(`createRoomInZoneId encountered ${err}`)
            throw(err);
        }
    }

    async addZoneById(id) {
        try {
            //make sure id is an ObjectId object
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
            //make sure id is an ObjectId object
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
            //make sure id is an ObjectId object
            this.zones.delete(id);
            logger.info(`zoneManager deleted zone with id ${id} from zones.`)
        } catch(err) {throw err};
    }
}

export default ZoneManager;
