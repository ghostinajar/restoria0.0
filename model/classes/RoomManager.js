import logger from '../../logger.js';

//handles active room instances in the game
class RoomManager {
    constructor(zone) {
        this.zone = zone;
        this.rooms = new Map();
    };
  
    async addRooms(roomId) {
        try {
            //get zone and room data
            const zone = this.zone;
            
            //instantiate room instances
            if (zone) {
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
                logger.error(`A roomManager has no reference to its zone!`)
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

    clearContents() {
        zone = null;
        rooms = []
    }
}

export default RoomManager;