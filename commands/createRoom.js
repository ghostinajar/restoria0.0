// createRoom
// saves incoming data from create_room_form user submission
import makeMessage from "../util/makeMessage.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import roomSchema from "../model/classes/Room.js";
import mongoose from "mongoose";
import ROOM_TYPE from "../constants/ROOM_TYPE.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import truncateDescription from "../util/truncateDescription.js";
import exits from "./exits.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import { historyStartingNow } from "../model/classes/History.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getAvailableExitsForCreateRoom from "../util/getAvailableExitsForCreateRoom.js";
import makeExitToRoomId from "../util/makeExitToRoomId.js";
async function createRoom(roomFormData, user) {
    try {
        if (!roomFormData.direction || roomFormData.direction == ``) {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage("rejection", `We need to know which direction to create the room.`));
            return;
        }
        let originRoom = await getRoomOfUser(user);
        if (!originRoom) {
            throw new Error(`Couldn't find origin room to create room.`);
        }
        let originZone = await getZoneOfUser(user);
        if (!originZone) {
            throw new Error(`Couldn't find origin zone to create room.`);
        }
        const availableDirections = await getAvailableExitsForCreateRoom(user);
        if (!availableDirections.includes(roomFormData.direction)) {
            throw new Error(`exit already exists (this shouldn't be possible). Author ${user._id} trying to create ${roomFormData.direction} from room ${originRoom.name}.`);
        }
        const roomDescription = {
            examine: roomFormData.examine,
            study: roomFormData.study,
            research: roomFormData.research,
        };
        truncateDescription(roomDescription, user);
        let newRoomData = {
            _id: new mongoose.Types.ObjectId(),
            author: user._id,
            fromZoneId: originZone._id,
            roomType: ROOM_TYPE.NONE,
            name: roomFormData.name,
            history: historyStartingNow(),
            playerCap: 18,
            mobCap: 18,
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
        switch (roomFormData.direction) {
            case "north": {
                newRoomData.mapCoords = [
                    originRoom.mapCoords[0],
                    originRoom.mapCoords[1] - 1,
                    originRoom.mapCoords[2],
                ];
                newRoomData.exits.south = makeExitToRoomId(originRoom._id, originZone._id);
                originRoom.exits.north = makeExitToRoomId(newRoomData._id, originZone._id);
                break;
            }
            case "east": {
                newRoomData.mapCoords = [
                    originRoom.mapCoords[0] + 1,
                    originRoom.mapCoords[1],
                    originRoom.mapCoords[2],
                ];
                newRoomData.exits.west = makeExitToRoomId(originRoom._id, originZone._id);
                originRoom.exits.east = makeExitToRoomId(newRoomData._id, originZone._id);
                break;
            }
            case "south": {
                newRoomData.mapCoords = [
                    originRoom.mapCoords[0],
                    originRoom.mapCoords[1] + 1,
                    originRoom.mapCoords[2],
                ];
                newRoomData.exits.north = makeExitToRoomId(originRoom._id, originZone._id);
                originRoom.exits.south = makeExitToRoomId(newRoomData._id, originZone._id);
                break;
            }
            case "west": {
                newRoomData.mapCoords = [
                    originRoom.mapCoords[0] - 1,
                    originRoom.mapCoords[1],
                    originRoom.mapCoords[2],
                ];
                newRoomData.exits.east = makeExitToRoomId(originRoom._id, originZone._id);
                originRoom.exits.west = makeExitToRoomId(newRoomData._id, originZone._id);
                break;
            }
            case "up": {
                newRoomData.mapCoords = [
                    originRoom.mapCoords[0],
                    originRoom.mapCoords[1],
                    originRoom.mapCoords[2] + 1,
                ];
                newRoomData.exits.down = makeExitToRoomId(originRoom._id, originZone._id);
                originRoom.exits.up = makeExitToRoomId(newRoomData._id, originZone._id);
                break;
            }
            case "down": {
                newRoomData.mapCoords = [
                    originRoom.mapCoords[0],
                    originRoom.mapCoords[1],
                    originRoom.mapCoords[2] - 1,
                ];
                newRoomData.exits.up = makeExitToRoomId(originRoom._id, originZone._id);
                originRoom.exits.down = makeExitToRoomId(newRoomData._id, originZone._id);
                break;
            }
            default:
                break;
        }
        if (newRoomData.mapCoords[0] > 79 ||
            newRoomData.mapCoords[0] < 0 ||
            newRoomData.mapCoords[1] > 79 ||
            newRoomData.mapCoords[1] < 0 ||
            newRoomData.mapCoords[2] > 10 ||
            newRoomData.mapCoords[2] > -10) {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage("rejection", `Sorry, your room couldn't be saved due to a map error. Ralu will look into this ASAP.`));
        }
        originZone.rooms.push(newRoomData);
        await originZone.save();
        await originZone.initRooms();
        logger.info(`Author "${user.name}" created room "${newRoomData.name}".`);
        worldEmitter.emit(`messageFor${user.username}`, makeMessage("success", `You created ${newRoomData.name}, ${roomFormData.direction} from here!`));
        await exits(user);
    }
    catch (error) {
        catchErrorHandlerForFunction("createRoom", error, user.name);
    }
}
export default createRoom;
