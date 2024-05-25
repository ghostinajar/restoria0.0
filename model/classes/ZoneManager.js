import mongoose from 'mongoose';
import logger from '../../logger.js';
import Zone from './Zone.js';
import RoomManager from './RoomManager.js';

class ZoneManager {
    constructor() {
        this.zones = new Map();
        this.roomManagers = new Map();
    };
  
    async createEntityInZoneId (zoneId, entityType, entity) {
        
        // validate entityType
        const validEntityTypes = ['item', 'mob', 'room', 'suggestion'];
        if (!validEntityTypes.includes(entityType)) {
            throw new Error(`Invalid entity type: ${entityType}. Must be one of ${validEntityTypes.join(', ')}`);
        }
        
        try {
            // give subdocument an ObjectId
            const entityId = new mongoose.Types.ObjectId();
            entity._id = entityId;

            // validate zone
            const zone = await this.zones.get(zoneId.toString());
            if (!zone) {
                throw new Error(`Invalid zoneId: ${zoneId}`);
            }

            // function to report creation success
            const creationReport = () => {
                logger.info(`zoneManager created ${entityType}: "${entity.name}" in "${zone.name}".`);
            };

            // create the entity
            switch (entityType) {
                case 'item' : {
                    zone.items.set(entity._id.toString(), entity);
                    creationReport();
                    break;
                }
                case 'mob' : {
                    zone.mobs.set(entity._id.toString(), entity);
                    creationReport();
                    break;
                }
                case 'room' : {
                    if(entity.mapCoords) {
                    const newRoomCoords = JSON.stringify(entity.mapCoords);
                        // If newRoomCoords match an existing room's, set new room's coords to []
                        for (let room of zone.rooms.values()) {
                            if (JSON.stringify(room.mapCoords) === newRoomCoords) {
                                entity.mapCoords = []
                                // TODO notify User their new room's duplicate coords were wiped
                            }
                        }
                    };
                    zone.rooms.set(entity._id.toString(), entity);
                    creationReport();
                    break;
                }
                case 'suggestion' : {
                    zone.suggestions.set(entity._id.toString(), entity);
                    creationReport();
                    break;
                }
            }
            return await zone.save();
        } catch(err) {
            logger.error(`Error in createEntityInZoneId: ${err.message}`);
            throw(err);
        }
    }

    async addZoneById(id) {
        try {
            const zone = await Zone.findById(id);
            if (zone) {
                if (!this.zones.has(zone._id.toString())) {
                    this.zones.set(zone._id.toString(), zone);
                    // Create a new RoomManager for this zone
                    this.roomManagers.set(zone._id.toString(), new RoomManager());
                    logger.info(`zoneManager added ${zone.name} to zones.`);
                } else {
                    logger.warn(`Zone with id ${id} already exists in zones.`);
                }
                logger.info(`Active zones: ${JSON.stringify(Array.from(this.zones.values()).map(zone => zone.name))}`);
                return zone;
            } else {
                logger.error(`zoneManager couldn't add zone with id ${id} to zones.`)
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
                // Remove all rooms and their contents from the zone
                for (let room of zone.rooms.values()) {
                    // Assuming each room has a method to clear its contents
                    room.clearContents();
                    // Remove the room from the zone
                    zone.rooms.delete(room._id.toString());
                }
                // Remove the zone
                logger.info(`Removing zone "${zone.name}" from zones.`)
                this.zones.delete(id.toString());
                // Remove the zone's roomManager
                this.roomManagers.delete(id.toString())
                logger.info(`Active zones: ${JSON.stringify(Array.from(this.zones.values()).map(zone => zone.name))}`);
            } else {
                logger.warn(`Zone with id ${id} does not exist in zones.`);
            }
        } catch(err) {
            logger.error(`Error in removeZoneById: ${err.message}`);
            throw err;
        }
    }
    
}

export default ZoneManager;