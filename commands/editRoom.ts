// editRoom
import mongoose, { Mongoose } from "mongoose";
import logger from "../logger.js";
import { IDescription } from "../model/classes/Description.js";
import { IRoom } from "../model/classes/Room.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import { IZone } from "../model/classes/Zone.js";
import makeMessage from "../util/makeMessage.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import truncateDescription from "../util/truncateDescription.js";
import { IMobNode } from "../model/classes/MobNode.js";
import { IItemNode } from "../model/classes/ItemNode.js";
import { IExit } from "../model/classes/Exit.js";

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
  if (!room || !roomData || !user) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(`rejected`, `Oops! Can't seem to edit this room.`)
    );
    return;
  }

  const newRoomDescription: IDescription = {
    examine: roomData.description.examine,
    study: roomData.description.study,
    research: roomData.description.research,
  };

  truncateDescription(newRoomDescription, user);

  room.history.modifiedDate = new Date();
  const zone: IZone = await getZoneOfUser(user);
  if (!zone) {
    logger.error(
      `editRoom couldn't find zone to save for user ${user.username}'s location.}`
    );
    return;
  }

  // make the edits
  room.name = roomData.name;
  room.description = newRoomDescription;
  room.isDark = roomData.isDark;
  room.isIndoors = roomData.isIndoors;
  room.isOnWater = roomData.isOnWater;
  room.isUnderwater = roomData.isUnderwater;
  room.noMounts = roomData.noMounts;
  room.noMobs = roomData.noMobs;
  room.noMagic = roomData.noMagic;
  room.noCombat = roomData.noCombat;
  room.playerCap = roomData.playerCap;
  room.mobCap = roomData.mobCap;
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
  worldEmitter.emit(
    `messageFor${user.username}`,
    makeMessage(`success`, `Room updated!`)
  );

  return;
}

export default editRoom;
