// getLookArrayForTarget
// fills an array with the target's description, items, equipment
import { IItem } from "../model/classes/Item.js";
import { IMob } from "../model/classes/Mob.js";
import { IUser } from "../model/classes/User.js";
import IMessage from "../types/Message.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import makeMessage from "./makeMessage.js";

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
    catchErrorHandlerForFunction("pushTargetEquipped", error);
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
    catchErrorHandlerForFunction("pushTargetInventory", error);
  }
}

function getLookArrayForTarget(targetObject: IUser | IItem | IMob, checkEquipped: boolean) {
  try {
    let lookArray: Array<IMessage> = [];
    lookArray.push(makeMessage(`heading`, `Name: ${targetObject.name}`));

    if (targetObject.description.examine) {
      lookArray.push(
        makeMessage(`description`, `${targetObject.description.examine}`)
      );
    }

    if (targetObject.inventory) {
      pushTargetInventory(targetObject, lookArray);
    }

    if (checkEquipped) {
      pushTargetEquipped(targetObject as IUser | IMob, lookArray);
    }

    return lookArray;
  } catch (error: unknown) {
    catchErrorHandlerForFunction("getLookArrayForTarget", error);
  }
}

export default getLookArrayForTarget;
