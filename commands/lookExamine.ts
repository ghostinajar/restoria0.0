// lookExamine
// shows the user what's in their room,
// or the description and contents of a target
import worldEmitter from "../model/classes/WorldEmitter.js";
import { IUser } from "../model/classes/User.js";
import { IParsedCommand } from "../util/parseCommand.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import selectTargetByOrdinal from "../util/selectTargetByOrdinal.js";
import messageMissingTargetToUser from "../util/messageMissingTargetToUser.js";
import roomSchema, { IRoom } from "../model/classes/Room.js";
import IMessage from "../types/Message.js";
import makeMessage from "../util/makeMessage.js";
import { IMob } from "../model/classes/Mob.js";
import { IItem } from "../model/classes/Item.js";
import { IDescription } from "../model/classes/Description.js";
import automap from "./autoMap.js";

async function lookExamine(parsedCommand: IParsedCommand, user: IUser) {
  try {
    const room = await getRoomOfUser(user);
    if (!room) {
      throw new Error(`Room not found for user ${user.name}`);
    }
    const targetKeyword = parsedCommand.directObject || "";
    const lookExamineArray: Array<IMessage> = [];
    const lookOrExamine: keyof IDescription = parsedCommand.commandWord as keyof IDescription;
    let targetObject;

    // set targetObject if it's a room (or no target)
    if (!targetKeyword || targetKeyword === "room") {
      targetObject = room;
    }

    // set targetObject if it's a user
    let userObject = room.users.find((user) => user.username === targetKeyword);
    if (userObject) {
      targetObject = userObject;
    }

    // set targetObject if it's a mob
    let targetOrdinal = parsedCommand.directObjectOrdinal || 0;
    let mobObject = selectTargetByOrdinal(
      targetOrdinal,
      targetKeyword,
      room.mobs
    );
    if (mobObject) {
      targetObject = mobObject;
    }

    // set targetObject if it's an item
    let itemObject = selectTargetByOrdinal(
      targetOrdinal,
      targetKeyword,
      room.inventory
    );
    if (itemObject) {
      targetObject = itemObject;
    }

    // message user target is missing
    if (!targetObject) {
      messageMissingTargetToUser(user, targetKeyword);
      return;
    }

    // pack target name
    let nameText = `Name: ${targetObject.name}`;
    if ("roomType" in targetObject) {
      nameText = targetObject.name;
    }
    lookExamineArray.push(makeMessage(`heading`, nameText));

    // pack target description
    let objectDescription = makeMessage(
      `description`,
      `${targetObject.description[lookOrExamine]}`
    );
    if (user.preferences.autoExamine) {
      objectDescription.content = `${targetObject.description.examine}`
    }
    if (!objectDescription.content || objectDescription.content === "undefined") {
      objectDescription.content = `This zone's author needs to add a description here.`
    }
    lookExamineArray.push(objectDescription);

    // pack target equipment
    if ("equipped" in targetObject) {
      pushTargetEquipped(targetObject as IUser | IMob, lookExamineArray);
    }

    // pack target inventory
    pushTargetInventory(targetObject, lookExamineArray);

    // if target is room, pack mobs
    if ("mobs" in targetObject) {
      for (let mobInRoom of room.mobs) {
        const message = makeMessage(
          `mobIsHere`,
          `${mobInRoom.description.look}`
        );
        lookExamineArray.push(message);
      }
    }

    // if target is room, pack users
    if ("users" in targetObject) {
      for (let userInRoom of room.users) {
        const message = makeMessage(
          `userIsHere`,
          `${userInRoom.name} is here.`
        );
        if (userInRoom.name !== user.name) lookExamineArray.push(message);
      }
    }

    worldEmitter.emit(`messageArrayFor${user.username}`, lookExamineArray);
    await automap(user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction("lookExamine", error, user.name);
  }
}

function pushTargetEquipped(
  targetObject: IUser | IMob,
  lookExamineArray: Array<IMessage>
) {
  try {
    lookExamineArray.push(makeMessage(`heading`, `Equipped:`));
    // for every item in target's IEquipped object, push a message with its .name to lookExamineArray
    for (let [key, value] of Object.entries(targetObject.equipped)) {
      if (
        value &&
        key !== "$__parent" &&
        key !== "$__" &&
        key !== "$isNew" &&
        key !== "$__v" &&
        key !== "$_id" &&
        key !== "_doc"
      ) {
        let message = makeMessage(`equippedItemName`, `${key}: ${value.name}`);
        lookExamineArray.push(message);
      }
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction("pushTargetEquipped", error);
  }
}

function pushTargetInventory(
  targetObject: IUser | IMob | IItem | IRoom,
  lookExamineArray: Array<IMessage>
) {
  try {
    if (!("roomType" in targetObject)) {
      lookExamineArray.push(makeMessage(`heading`, `Inventory:`));
    }
    if (targetObject.inventory) {
      if ("roomType" in targetObject) {
        // room inventory (look descriptions)
        for (let itemInRoom of targetObject.inventory) {
          const message = makeMessage(
            `itemIsHere`,
            `${itemInRoom.description.look}`
          );
          lookExamineArray.push(message);
        }
      } else {
        // user, mob, or item inventory (names only)
        for (let item of targetObject.inventory) {
          let message = makeMessage(`itemName`, item.name);
          lookExamineArray.push(message);
        }
      }
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction("pushTargetInventory", error);
  }
}

export default lookExamine;
