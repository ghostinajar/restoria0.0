// createRoom
import makeMessage from "../types/makeMessage.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import roomSchema, { IRoom } from "../model/classes/Room.js";
import IMessage from "../types/Message.js";
import mongoose from "mongoose";
import { IUser } from "../model/classes/User.js";
import ROOM_TYPE from "../constants/ROOM_TYPE.js";
import COMPLETION_STATUS from "../constants/COMPLETION_STATUS.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import { IZone } from "../model/classes/Zone.js";
import createExit from "./createExit.js";

export interface IRoomData {
  name: string;
  direction: string;
  isDark: boolean;
  isIndoors: boolean;
  isOnWater: boolean;
  isUnderwater: boolean;
  examine: string;
  study: string;
  research: string;
}

// Return room, or a message explaining failure (if by author, emit message to their socket)
async function createRoom(
  roomFormData: IRoomData,
  author: IUser
): Promise<IRoom | IMessage> {
  try {
    logger.debug(`Trying to create room ${roomFormData.name}`);
    let message = makeMessage("rejection", ``);
    let originRoom : IRoom = await getRoomOfUser(author);
    if (!originRoom) {
      logger.error(`Couldn't find origin room to create room.`);
    }
    let originZone: IZone = await new Promise((resolve) => {
      worldEmitter.once(`zoneLoaded`, resolve);
      worldEmitter.emit(`zoneRequested`, author.location.inZone);
    });
    if (!originZone) {
      logger.error(`Couldn't find origin zone to create room.`);
    }

    let newRoomData: IRoom = {
      _id: new mongoose.Types.ObjectId(),
      author: author._id,
      fromZoneId: originZone._id,
      roomType: ROOM_TYPE.NONE,
      name: roomFormData.name,
      history: {
        creationDate: new Date(),
        modifiedDate: new Date(),
        completionStatus: COMPLETION_STATUS.DRAFT,
        completionDate: null,
      },
      playerCap: 30,
      mobCap: 30,
      isDark: roomFormData.isDark,
      isIndoors: roomFormData.isIndoors,
      isOnWater: roomFormData.isOnWater,
      isUnderwater: roomFormData.isUnderwater,
      isOnFire: false,
      blocksMounts: false,
      blocksMobs: false,
      blocksCasting: false,
      blocksCombat: false,
      itemsForSale: [],
      mountIdForSale: [],
      mapCoords: originRoom.mapCoords.slice(), // Copy to avoid mutation
      description: {
        examine: roomFormData.examine,
        study: roomFormData.study,
        research: roomFormData.research,
      },
      exits: {},
      mobNodes: [],
      itemNodes: [],
      inventory: [],
      mobs: [],
      users: [],
      addEntityTo : roomSchema.methods.addEntityTo,
      removeEntityFrom : roomSchema.methods.removeEntityFrom,
    };
    logger.debug(`createRoom made newRoomData: ${JSON.stringify(newRoomData)}`);

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
    logger.debug(`createRoom adjusted mapcoords in newRoom: ${JSON.stringify(newRoomData.mapCoords)}`);
    logger.debug(`createRoom adjusted exits in newRoomData ${JSON.stringify(newRoomData.exits)}`);
    logger.debug(`createRoom adjusted exits in originRoom ${JSON.stringify(originRoom.exits)}`);

    originZone.rooms.push(newRoomData);
    originZone.save();
    logger.debug(`Saved zone ${originZone.name} with rooms ${originZone.rooms.map(room => room.name)}`)

    logger.info(`Author "${author.name}" created room "${newRoomData.name}".`);
    message.type = "success";
    message.content = `You created ${newRoomData.name} to the ${roomFormData.direction}!`;
    worldEmitter.emit(`messageFor${author.username}`, message);

    return newRoomData;
  } catch (error: any) {
    logger.error(`Error in createUser: ${error.message} `);
    throw error;
  }
}

export default createRoom;
