import logger from '../../logger.js';
//TODO remove this class after methods are moved elsewhere
//handles active room instances in the game
class RoomManager {
    constructor(zone) {
        this.zone = zone;
        this.rooms = new Map();
    };

    //TODO move to zoneSchema.methods
    async addRooms() {
        try {
            //instantiate room instances
            if (this.zone) {
                    this.zone.rooms.forEach(room => {
                    this.rooms.set(room._id.toString(), room);
                    room.initiate(); //setup room's contents arrays (items, mobs, characters, users)
                    //TODO populate room's contents array from its mobNodes and itemNodes
                });
                //logger.info(`Active rooms in ${this.zone.name}: ${JSON.stringify(Array.from(this.rooms.values()).map(room => room.name))}`);
                return;
            } else {
                logger.error(`A roomManager has no reference to its zone!`)
            }
        } catch(err) {
            logger.error(`Error in addRoomFromZoneId: ${err.message}`);
            throw err;
        };
    }

    //TODO check if this is used anywhere, if not, delete
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