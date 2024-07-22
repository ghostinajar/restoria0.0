// lookTarget
import logger from "../logger.js";
import { IItem } from "../model/classes/Item.js";
import { IMob } from "../model/classes/Mob.js";
import { IRoom } from "../model/classes/Room.js";
import { IUser } from "../model/classes/User.js";
import IMessage from "../types/Message.js";
import makeMessage from "../types/makeMessage.js";

function pushTargetEquipped(
  targetObject: IUser | IMob,
  lookArray: Array<IMessage>
) {
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
}

function pushTargetInventory(
  targetObject: IUser | IMob | IItem,
  lookArray: Array<IMessage>
) {
  lookArray.push(makeMessage(`heading`, `Inventory:`));
  // for every item in target's inventory array, push a message with its .name to lookArray
  if (targetObject.inventory) {
    for (let item of targetObject.inventory) {
      let message = makeMessage(`itemName`, item.name);
      lookArray.push(message);
    }
  }
}

function lookTarget(target: string, room: IRoom, lookArray: Array<IMessage>) {
  let targetObject: IUser | IMob | IItem | undefined;

  // if users names include target
  // logger.debug(
  //   `Checking users array ${JSON.stringify(
  //     room.users.map((user) => user.username)
  //   )} for ${target}`
  // );
  targetObject = room.users.find((user) => user.username === target);
  if (targetObject) {
    // push a message for the target.name into lookArray
    lookArray.push(makeMessage(`heading`, `Name: ${targetObject.name}`));
    // push a message for the target.description.look into lookArray
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
  // logger.debug(
  //   `Checking mobs array ${JSON.stringify(
  //     room.mobs.map((mob) => mob.name)
  //   )} for ${target}`
  // );
  targetObject = room.mobs.find((mob) => mob.keywords.includes(target));
  if (targetObject) {
    // push a message for the target.name into lookArray
    lookArray.push(makeMessage(`heading`, `Name: ${targetObject.name}`));
    // push a message for the target.description.look into lookArray
    lookArray.push(
      makeMessage(`mobDescription`, `${targetObject.description.examine}`)
    );
    pushTargetEquipped(targetObject, lookArray);
    pushTargetInventory(targetObject, lookArray);
    return;
  }

  // if inventory names includes target
  // logger.debug(
  //   `Checking inventory ${JSON.stringify(
  //     room.inventory.map((item) => item.name)
  //   )} array for ${target}`
  // );
  targetObject = room.inventory.find((item) => item.keywords.includes(target));
  if (targetObject) {
    // push a message for the target.name into lookArray
    lookArray.push(makeMessage(`heading`, `Name: ${targetObject.name}`));
    // push a message for the target.description.look into lookArray
    lookArray.push(
      makeMessage(`itemDescription`, `${targetObject.description.examine}`)
    );
    if (targetObject.tags.container) {
      pushTargetInventory(targetObject, lookArray);
    }
    return;
  }

  // If no target found, push a message saying target not found
  lookArray.push(makeMessage(`rejected`, `No '${target}' found in the room.`));
}

export default lookTarget;
