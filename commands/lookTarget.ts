// lookTarget
// populates the lookArray for the look command
import logger from "../logger.js";
import { IItem } from "../model/classes/Item.js";
import { IMob } from "../model/classes/Mob.js";
import { IRoom } from "../model/classes/Room.js";
import { IUser } from "../model/classes/User.js";
import IMessage from "../types/Message.js";
import makeMessage from "../util/makeMessage.js";

function pushTargetEquipped(
  targetObject: IUser | IMob,
  lookArray: Array<IMessage>
) {
  try {
    lookArray.push(makeMessage(`heading`, `Equipped:`));
    // for every item in target's IEquipped object, push a message with its .name to lookArray
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
        lookArray.push(message);
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`pushTargetEquipped error: ${error.message}`);
    } else {
      logger.error(`pushTargetEquipped error: ${error}`);
    }
  }
}

function pushTargetInventory(
  targetObject: IUser | IMob | IItem,
  lookArray: Array<IMessage>
) {
  try {
    lookArray.push(makeMessage(`heading`, `Inventory:`));
    // for every item in target's inventory array, push a message with its .name to lookArray
    if (targetObject.inventory) {
      for (let item of targetObject.inventory) {
        let message = makeMessage(`itemName`, item.name);
        lookArray.push(message);
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`pushTargetInventory error: ${error.message}`);
    } else {
      logger.error(`pushTargetInventory error: ${error}`);
    }
  }
}

function lookTarget(target: string, room: IRoom, lookArray: Array<IMessage>) {
  try {
    let targetObject: IUser | IMob | IItem | undefined;

    // if users names include target
    targetObject = room.users.find((user) => user.username === target);
    if (targetObject) {
      lookArray.push(makeMessage(`heading`, `Name: ${targetObject.name}`));
      if (targetObject.description.examine) {
        lookArray.push(
          makeMessage(`userDescription`, `${targetObject.description.examine}`)
        );
      }
      pushTargetEquipped(targetObject, lookArray);
      pushTargetInventory(targetObject, lookArray);
      return;
    }

    // if mobs names includes target
    targetObject = room.mobs.find((mob) => mob.keywords.includes(target));
    if (targetObject) {
      lookArray.push(makeMessage(`heading`, `Name: ${targetObject.name}`));
      lookArray.push(
        makeMessage(`mobDescription`, `${targetObject.description.examine}`)
      );
      pushTargetEquipped(targetObject, lookArray);
      pushTargetInventory(targetObject, lookArray);
      return;
    }

    // if inventory names includes target
    targetObject = room.inventory.find((item) =>
      item.keywords.includes(target)
    );
    if (targetObject) {
      lookArray.push(makeMessage(`heading`, `Name: ${targetObject.name}`));
      lookArray.push(
        makeMessage(`itemDescription`, `${targetObject.description.examine}`)
      );
      if (targetObject.tags.container) {
        pushTargetInventory(targetObject, lookArray);
      }
      return;
    }

    // If no target found, push a message saying target not found
    lookArray.push(
      makeMessage(`rejected`, `There doesn't seem to be a '${target}' here.`)
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`lookTarget error for target ${target}: ${error.message}`);
    } else {
      logger.error(`lookTarget error for target ${target}: ${error}`);
    }
  }
}

export default lookTarget;
