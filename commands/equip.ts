// equip
// user can EQUIP an item to an appropriate slot
// this command switches on item type to call WEAR (for armor) or WIELD (for weapon)

import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import findObjectInInventory from "../util/findObjectInInventory.js";
import messageToUsername from "../util/messageToUsername.js";
import { IParsedCommand } from "../util/parseCommand.js";
import wear from "./wear.js";
import wield from "./wield.js";

async function equip(parsedCommand: IParsedCommand, user: IUser) {
  try {
    // Fail if user doesn't have the item in their inventory
    const targetKeyword = parsedCommand.directObject;
    if (!targetKeyword) {
      throw new Error("No target keyword provided.");
    }
    const item = findObjectInInventory(
      user.inventory,
      targetKeyword,
      parsedCommand.directObjectOrdinal
    );
    if (!item) {
      messageToUsername(
        user.username,
        `You don't have the ${targetKeyword} in your inventory.`,
        `rejection`
      );
      return;
    }
    // console.log(`item found! ${item.name}`);

    // Fail if item is not a weapon or armor
    if (item.itemType !== "weapon" && item.itemType !== "armor") {
      messageToUsername(
        user.username,
        `Sadly, ${item.name} wasn't made to be equipped.`,
        `rejection`
      );
      return;
    }
    // console.log(`${item.name} is a weapon or armor!`);

    if (item.itemType === "armor") {
      // Call wear function
      await wear(item, user, parsedCommand.indirectObject);
      return;
    }

    if (item.itemType === "weapon") {
      // Call wield function
      await wield(item, user);
      return;
    }
    throw new Error(`Couldn't run equip on item: ${item.name}, id: ${item._id}`);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`equip`, error, user?.name);
  }
}

export default equip;
