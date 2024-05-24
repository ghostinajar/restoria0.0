import logger from '../../logger.js';
import ensureIdIsObjectId from '../ensureIdIsObjectId.js';
import ROOM_TYPE from '../../constants/ROOM_TYPE.js';

class RoomManager {
    constructor() {
        this.rooms = new Map();  // Stores all rooms with their ObjectId as key
    };

    async addRoomById(id) {
        try {
            ensureIdIsObjectId(id);
            //TODO get a room from a zone object
            if (room) {
                logger.info(`roomManager retrieved ${room.name}, id: ${room._id}.`);
                this.rooms.set(room._id, room);
                //logger.info(`roomManager added ${room.name} to rooms.`);
                return room;
            } else {
                logger.error(`roomManager couldn't add room with id ${id} to rooms.`)
            }
        } catch(err) {throw err};
    }

    async getRoomById(id) {
        try {
            ensureIdIsObjectId(id);
            const room = this.rooms.get(id);
            if (room) {
                //logger.info(`roomManager got ${room.name} from rooms.`);
                return room;
            } else {
                logger.info(`roomManager can't find room with id: ${id}.`);
                return null;
            };
        } catch(err) {throw err;}
    }

    async removeRoomById(id) {
        try {
            ensureIdIsObjectId(id);
            this.rooms.delete(id);
            logger.info(`roomManager deleted room with id ${id} from rooms.`)
        } catch(err) {throw err};
    }
}

export default RoomManager;
