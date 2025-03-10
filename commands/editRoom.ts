// editRoom
// allows user to edit details of a room
import mongoose from "mongoose";
import { IDescription } from "../model/classes/Description.js";
import { IRoom } from "../model/classes/Room.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import truncateDescription from "../util/truncateDescription.js";
import { IExit } from "../model/classes/Exit.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import putNumberInRange from "../util/putNumberInRange.js";
import lookExamine from "./lookExamine.js";

export interface IEditRoomFormData {
  _id: string | mongoose.Types.ObjectId;
  name: string;
  description: IDescription;
  isDark: boolean;
  isIndoors: boolean;
  isOnWater: boolean;
  isUnderwater: boolean;
  noMounts: boolean;
  noMobs: boolean;
  noMagic: boolean;
  noCombat: boolean;
  playerCap: number;
  mobCap: number;
  mobNodes: Array<{ _id: string; loadsBlueprintId: string; name: string }>;
  itemNodes: Array<{ _id: string; loadsBlueprintId: string; name: string }>;
  exits: {
    north?: IExit;
    south?: IExit;
    east?: IExit;
    west?: IExit;
    up?: IExit;
    down?: IExit;
  };
}

async function editRoom(room: IRoom, roomData: IEditRoomFormData, user: IUser) {
  try {
    const zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error(`Couldn't get ${user.username}'s zone.`);
    }

    if (user._id.toString() !== zone.author.toString()) {
      worldEmitter.emit(`messageFor${user.username}`, makeMessage(
        `rejection`, `Tsk, you aren't an author of this zone. GOTO one of your own and EDIT there.`
      ))
      return;
    }

    truncateDescription(roomData.description, user);

    room.history.modifiedDate = new Date();

    room.name = roomData.name;
    room.description = roomData.description;
    room.isDark = roomData.isDark;
    room.isIndoors = roomData.isIndoors;
    room.isOnWater = roomData.isOnWater;
    room.isUnderwater = roomData.isUnderwater;
    room.noMounts = roomData.noMounts;
    room.noMobs = roomData.noMobs;
    room.noMagic = roomData.noMagic;
    room.noCombat = roomData.noCombat;
    room.playerCap = putNumberInRange(0, 18, roomData.playerCap, user);
    room.mobCap = putNumberInRange(0, 18, roomData.mobCap, user);
    //clear room.mobNodes and replace with processed roomData.mobNodes
    room.mobNodes = [];
    roomData.mobNodes.forEach((node) => {
      room.mobNodes.push({
        _id: new mongoose.Types.ObjectId(),
        loadsBlueprintId: new mongoose.Types.ObjectId(node.loadsBlueprintId),
        fromZoneId: zone._id,
      });
    });
    //clear room.itemNodes and replace with processed roomData.itemNodes
    room.itemNodes = [];
    roomData.itemNodes.forEach((node) => {
      room.itemNodes.push({
        _id: new mongoose.Types.ObjectId(),
        loadsBlueprintId: new mongoose.Types.ObjectId(node.loadsBlueprintId),
        fromZoneId: zone._id,
      });
    });

    room.exits = roomData.exits;

    await zone.save();
    await zone.initRooms();
    await lookExamine({commandWord: 'look'}, user)
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(`success`, `Room updated!`)
    );
  } catch (error: unknown) {
    catchErrorHandlerForFunction("editRoom", error, user.name);
  }
}

export default editRoom;
