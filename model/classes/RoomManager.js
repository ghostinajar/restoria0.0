import logger from '../../logger.js';

//handles active room instances in the game
class RoomManager {
    constructor() {
        this.rooms = new Map();
    };
  
    async addRoomFromZoneId(zoneId, roomId) {
        try {
            //get zone and room data
            const zone = world.zoneManager.getZoneById(zoneId.toString());
            const room = zone.rooms.get(roomId.toString());
            
            //check for duplicate rooms, add room
            if (zone && room) {
                if (!this.rooms.has(room._id.toString())) {
                    this.rooms.set(room._id.toString(), room);
                    logger.info(`zoneManager added ${room.name} to rooms.`);
                } else {
                    logger.warn(`Room with id ${roomId} already exists in rooms.`);
                }
                logger.info(`Active rooms: ${JSON.stringify(Array.from(this.rooms.values()).map(room => room.name))}`);
                room.initiate(); //setup room's contents arrays (items, mobs, characters, users)
                //TODO populate room's contents array
                return room;
            } else {
                logger.error(`roomManager couldn't add room with id ${id} to rooms.`)
            }
        } catch(err) {
            logger.error(`Error in addRoomFromZoneId: ${err.message}`);
            throw err;
        };
    }

    async getRoomById(id) {
        try {
            const room = this.rooms.get(id.toString());
            if (room) {
                return room;
            } else {
                logger.info(`roomManager can't find room with id: ${id}.`);
                return null;
            };
        } catch(err) {
            logger.error(`Error in getRoomById: ${err.message}`);
            throw err;
        }
    }

}

export default RoomManager;