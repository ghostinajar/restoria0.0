// createRoom
// saves incoming data from create_room_form user submission
import makeMessage from "../util/makeMessage.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import roomSchema, { IRoom } from "../model/classes/Room.js";
import mongoose from "mongoose";
import { IUser } from "../model/classes/User.js";
import ROOM_TYPE from "../constants/ROOM_TYPE.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import createExit from "./createExit.js";
import { IDescription } from "../model/classes/Description.js";
import truncateDescription from "../util/truncateDescription.js";
import exits from "./exits.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import { historyStartingNow } from "../model/classes/History.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getAvailableExitsForCreateRoom from "../util/getAvailableExitsForCreateRoom.js";

export interface INewRoomData {
  name: string;
  direction: string;
  isDark: boolean;
  isIndoors: boolean;
  isOnWater: boolean;
  isUnderwater: boolean;
  noMounts: boolean;
  noMobs: boolean;
  noMagic: boolean;
  noCombat: boolean;
  examine: string;
  study: string;
  research: string;
}

// Return room, or a message explaining failure (if by user, emit message to their socket)
async function createRoom(roomFormData: INewRoomData, user: IUser) {
  try {
    if (!roomFormData.direction || roomFormData.direction == ``) {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(
          "rejection",
          `We need to know which direction to create the room.`
        )
      );
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
      throw new Error(
        `exit already exists (this shouldn't be possible). Author ${user._id} trying to create ${roomFormData.direction} from room ${originRoom.name}.`
      );
    }

    const roomDescription: IDescription = {
      examine: roomFormData.examine,
      study: roomFormData.study,
      research: roomFormData.research,
    };
    truncateDescription(roomDescription, user);

    let newRoomData: IRoom = {
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

    originZone.rooms.push(newRoomData);
    await originZone.save();
    await originZone.initRooms();

    logger.info(`Author "${user.name}" created room "${newRoomData.name}".`);
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        "success",
        `You created ${newRoomData.name}, ${roomFormData.direction} from here!`
      )
    );
    await exits(user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction("createRoom", error, user.name)
  }
}

export default createRoom;
