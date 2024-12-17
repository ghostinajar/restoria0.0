// look
// shows the user what's in their room,
// or the description and contents of a target
import worldEmitter from "../model/classes/WorldEmitter.js";
import { IUser } from "../model/classes/User.js";
import { IParsedCommand } from "../util/parseCommand.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getLookArrayForRoom from "../util/getLookArrayForRoom.js";
import getLookArrayForTarget from "../util/getLookArrayForTarget.js";
import selectTargetByOrdinal from "../util/selectTargetByOrdinal.js";
import makeMessage from "../util/makeMessage.js";

async function look(parsedCommand: IParsedCommand, user: IUser) {
  try {
    const room = await getRoomOfUser(user);
    if (!room) {
      throw new Error(`Room not found for user ${user.name}`);
    }

    let targetKeyword = parsedCommand.directObject;
    let lookArray = getLookArrayForRoom(room, user);

    // target is missing or room
    if (!targetKeyword || targetKeyword === "room") {
      worldEmitter.emit(`messageArrayFor${user.username}`, lookArray);
      return;
    }

    // target is a user?
    let checkEquipped = true;
    let userObject = room.users.find((user) => user.username === targetKeyword);
    if (userObject) {
      lookArray = getLookArrayForTarget(userObject, checkEquipped);
      worldEmitter.emit(`messageArrayFor${user.username}`, lookArray);
      return;
    }

    //target is a mob?
    let targetOrdinal = parsedCommand.directObjectOrdinal || 0;
    let mobObject = selectTargetByOrdinal(
      targetOrdinal,
      targetKeyword,
      room.mobs
    );
    if (mobObject) {
      lookArray = getLookArrayForTarget(mobObject, checkEquipped);
      worldEmitter.emit(`messageArrayFor${user.username}`, lookArray);
      return;
    }

    //target is an item?
    checkEquipped = false;
    let itemObject = selectTargetByOrdinal(
      targetOrdinal,
      targetKeyword,
      room.inventory
    );
    if (itemObject) {
      lookArray = getLookArrayForTarget(itemObject, checkEquipped);
      worldEmitter.emit(`messageArrayFor${user.username}`, lookArray);
      return;
    }

    console.log(`Messaging ${user.name}`);
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        `failure`,
        `You can't seem to find that ${targetKeyword.toString()}.`
      )
    );
  } catch (error: unknown) {
    catchErrorHandlerForFunction("look", error, user.name);
  }
}

export default look;
