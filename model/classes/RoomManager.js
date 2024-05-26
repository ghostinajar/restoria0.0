import logger from '../../logger.js';

//handles active room instances in the game
class RoomManager {
    constructor(zone) {
        this.zone = zone;
        this.rooms = new Map();
    };
  
    async addRooms() {
        try {
            //instantiate room instances
            if (this.zone) {
                    this.zone.rooms.forEach(room => {
                    this.rooms.set(room._id.toString(), room);
                    room.initiate(); //setup room's contents arrays (items, mobs, characters, users)
                });
                logger.info(`Active rooms: ${JSON.stringify(Array.from(this.rooms.values()).map(room => room.name))}`);
                //TODO populate room's contents array
                return;
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