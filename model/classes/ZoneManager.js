import mongoose from 'mongoose';
import logger from '../../logger.js';
import Zone from './Zone.js';
import RoomManager from './RoomManager.js';

class ZoneManager {
    constructor() {
        this.zones = new Map();
        this.roomManagers = new Map();
    };
  
    //TODO move to zoneSchema.methods
    async createEntityInZoneId (zoneId, entityType, entity) {
        
        // validate entityType
        const validEntityTypes = ['itemBlueprint', 'mobBlueprint', 'room', 'suggestion'];
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
                case 'itemBlueprint' : {
                    zone.itemBlueprints.set(entity._id.toString(), entity);
                    creationReport();
                    break;
                }
                case 'mobBlueprint' : {
                    zone.mobBlueprints.set(entity._id.toString(), entity);
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
            //if zone exists and isn't already in zones map
            if (zone && !this.zones.has(zone._id.toString())) {  
                // add zone to zones map              
                this.zones.set(zone._id.toString(), zone);
                logger.info(`zoneManager added ${zone.name} to zones.`);

                // create a new RoomManager for this zone
                const newRoomManager = new RoomManager(zone);
                this.roomManagers.set(zone._id.toString(), newRoomManager);
                
                // load rooms into roomManager
                newRoomManager.addRooms();

                logger.info(`Active zones: ${JSON.stringify(Array.from(this.zones.values()).map(zone => zone.name))}`);
                return zone;
            } else {
                logger.error(`zoneManager couldn't add zone with id ${id} to zones.`)
                return null;
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

    clearContents() {
        this.zones = [];
        this.roomManagers = [];
    }
    
}

export default ZoneManager;