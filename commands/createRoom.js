// createRoom
import makeMessage from "../types/makeMessage.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import roomSchema from "../model/classes/Room.js";
import mongoose from "mongoose";
import ROOM_TYPE from "../constants/ROOM_TYPE.js";
import COMPLETION_STATUS from "../constants/COMPLETION_STATUS.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import createExit from "./createExit.js";
import unusedExitsForUser from "../util/unusedExitsForUser.js";
import truncateDescription from "../util/truncateDescription.js";
import exits from "./exits.js";
// Return room, or a message explaining failure (if by author, emit message to their socket)
async function createRoom(roomFormData, author) {
    try {
        let message = makeMessage("rejection", ``);
        if (!roomFormData.direction || roomFormData.direction == ``) {
            logger.error(`createRoom rejected, No direction selected.`);
            message.content = `Can't create a room without a direction!`;
            return message;
        }
        // logger.debug(`Trying to create room ${roomFormData.name}, ${roomFormData.direction}.`);
        let originRoom = await getRoomOfUser(author);
        if (!originRoom) {
            logger.error(`Couldn't find origin room to create room.`);
        }
        let originZone = await new Promise((resolve) => {
            worldEmitter.once(`zone${author.location.inZone.toString()}Loaded`, resolve);
            worldEmitter.emit(`zoneRequested`, author.location.inZone.toString());
        });
        if (!originZone) {
            logger.error(`Couldn't find origin zone to create room.`);
        }
        const unusedExits = await unusedExitsForUser(author);
        // logger.debug(`createRoom found unusedExitsForUser: ${unusedExits}.`)
        if (!unusedExits.includes(roomFormData.direction)) {
            logger.error(`createRoom rejected, exit already exists (this shouldn't be possible). Author ${author._id} trying to create ${roomFormData.direction} from room ${originRoom.name}.`);
            message.content = `Can't create the room. That exit already goes somewhere!`;
            return message;
        }
        const roomDescription = {
            examine: roomFormData.examine,
            study: roomFormData.study,
            research: roomFormData.research,
        };
        truncateDescription(roomDescription, author);
        let newRoomData = {
            _id: new mongoose.Types.ObjectId(),
            author: author._id,
            fromZoneId: originZone._id,
            roomType: ROOM_TYPE.NONE,
            name: roomFormData.name,
            history: {
                creationDate: new Date(),
                modifiedDate: new Date(),
                completionStatus: COMPLETION_STATUS.DRAFT,
            },
            playerCap: 30,
            mobCap: 30,
            isDark: roomFormData.isDark,
            isIndoors: roomFormData.isIndoors,
            isOnWater: roomFormData.isOnWater,
            isUnderwater: roomFormData.isUnderwater,
            noMounts: false,
            noMobs: false,
            noMagic: false,
            noCombat: false,
            itemsForSale: [],
            mountIdForSale: [],
            mapCoords: originRoom.mapCoords.slice(), // Copy to avoid mutation
            description: roomDescription,
            exits: {},
            mobNodes: [],
            itemNodes: [],
            inventory: [],
            mobs: [],
            users: [],
            addEntityTo: roomSchema.methods.addEntityTo,
            removeEntityFrom: roomSchema.methods.removeEntityFrom,
        };
        // logger.debug(`createRoom made newRoomData: ${JSON.stringify(newRoomData)}`);
        switch (roomFormData.direction) {
            case "north": {
                newRoomData.mapCoords = [
                    originRoom.mapCoords[0],
                    originRoom.mapCoords[1] - 1,
                    originRoom.mapCoords[2],
                ];
                newRoomData.exits.south = createExit(originRoom._id, originZone._id);
                originRoom.exits.north = createExit(newRoomData._id, originZone._id);
                break;
            }
            case "east": {
                newRoomData.mapCoords = [
                    originRoom.mapCoords[0] + 1,
                    originRoom.mapCoords[1],
                    originRoom.mapCoords[2],
                ];
                newRoomData.exits.west = createExit(originRoom._id, originZone._id);
                originRoom.exits.east = createExit(newRoomData._id, originZone._id);
                break;
            }
            case "south": {
                newRoomData.mapCoords = [
                    originRoom.mapCoords[0],
                    originRoom.mapCoords[1] + 1,
                    originRoom.mapCoords[2],
                ];
                newRoomData.exits.north = createExit(originRoom._id, originZone._id);
                originRoom.exits.south = createExit(newRoomData._id, originZone._id);
                break;
            }
            case "west": {
                newRoomData.mapCoords = [
                    originRoom.mapCoords[0] - 1,
                    originRoom.mapCoords[1],
                    originRoom.mapCoords[2],
                ];
                newRoomData.exits.east = createExit(originRoom._id, originZone._id);
                originRoom.exits.west = createExit(newRoomData._id, originZone._id);
                break;
            }
            case "up": {
                newRoomData.mapCoords = [
                    originRoom.mapCoords[0],
                    originRoom.mapCoords[1],
                    originRoom.mapCoords[2] + 1,
                ];
                newRoomData.exits.down = createExit(originRoom._id, originZone._id);
                originRoom.exits.up = createExit(newRoomData._id, originZone._id);
                break;
            }
            case "down": {
                newRoomData.mapCoords = [
                    originRoom.mapCoords[0],
                    originRoom.mapCoords[1],
                    originRoom.mapCoords[2] - 1,
                ];
                newRoomData.exits.up = createExit(originRoom._id, originZone._id);
                originRoom.exits.down = createExit(newRoomData._id, originZone._id);
                break;
            }
            default:
                break;
        }
        // logger.debug(`createRoom adjusted mapcoords in newRoom: ${JSON.stringify(newRoomData.mapCoords)}`);
        // logger.debug(`createRoom adjusted exits in newRoomData ${JSON.stringify(newRoomData.exits)}`);
        // logger.debug(`createRoom adjusted exits in originRoom ${JSON.stringify(originRoom.exits)}`);
        originZone.rooms.push(newRoomData);
        await originZone.save();
        await originZone.initRooms();
        // logger.debug(`Saved zone ${originZone.name} with rooms ${originZone.rooms.map(room => room.name)}`)
        logger.info(`Author "${author.name}" created room "${newRoomData.name}".`);
        message.type = "success";
        message.content = `You created ${newRoomData.name}, ${roomFormData.direction} from here!`;
        worldEmitter.emit(`messageFor${author.username}`, message);
        await exits(author);
        return newRoomData;
    }
    catch (error) {
        logger.error(`Error in createRoom: ${error.message} `);
        throw error;
    }
}
export default createRoom;
