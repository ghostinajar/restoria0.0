// wear
// user can WEAR an armor-type item to an appropriate slot

import WEARABLE_LOCATION, {
  WEARABLE_LOCATION_VALUES,
} from "../constants/WEARABLE_LOCATION.js";
import { IItem } from "../model/classes/Item.js";
import { IUser } from "../model/classes/User.js";
import IEquipped from "../types/Equipped.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import findObjectInInventory from "../util/findObjectInInventory.js";
import messageToUsername from "../util/messageToUsername.js";
import { IParsedCommand } from "../util/parseCommand.js";

async function wear(parsedCommand: IParsedCommand, user: IUser) {
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
    console.log(`item found! ${item.name}`);

    // Fail if item is not armor
    if (item.itemType !== "armor") {
      messageToUsername(
        user.username,
        `${item.name} wasn't made to be worn.`,
        `rejection`
      );
      return;
    }
    console.log(`${item.name} is armor!`);

    // Fail if item has no wearable locations
    if (
      !item.wearableLocations ||
      !Object.values(item.wearableLocations).some(Boolean)
    ) {
      messageToUsername(
        user.username,
        `${item.name} wasn't designed with any wearable location.`,
        `rejection`
      );
      return;
    }
    // make an array and push the keys of the item.wearableLocations object into it if the value of that key is true
    const locationsItemIsWearable: string[] = item.wearableLocations
      ? Object.keys(item.wearableLocations).filter(
          (location) =>
            (item.wearableLocations ?? {})[
              location as keyof IItem["wearableLocations"]
            ]
        )
      : [];

    console.log(`item is wearable! locations:`);
    console.log(locationsItemIsWearable);

    // Fail if user and item aren't compatible (e.g. level, job, spirit)
    if (!checkItemCompatibilityWithUser(user, item)) {
      // NB checkItemCompatibilityWithUser already notified the user
      return;
    }
    console.log(`user and item are compatible!`);

    // Fail if indirect object is provided in parsedCommand but isn't a valid wearable location
    if (
      parsedCommand.indirectObject &&
      !WEARABLE_LOCATION_VALUES.some((location) =>
        location.startsWith(parsedCommand.indirectObject as string)
      )
    ) {
      messageToUsername(
        user.username,
        `${parsedCommand.indirectObject} isn't a place you can wear something.`,
        `help`
      );
      messageToUsername(
        user.username,
        `Read HELP EQUIP to find out more.`,
        `rejection`
      );
      return;
    }
    console.log(`indirect object is valid!`);

    // handle abbreviations of WEARABLE_LOCATION_VALUES
    let expandedLocation: string | undefined;
    if (parsedCommand.indirectObject === "f1") {
      expandedLocation = WEARABLE_LOCATION.FINGER1;
    }
    if (parsedCommand.indirectObject === "f2") {
      expandedLocation = WEARABLE_LOCATION.FINGER2;
    }
    if (parsedCommand.indirectObject === "w1") {
      expandedLocation = WEARABLE_LOCATION.WRIST1;
    }
    if (parsedCommand.indirectObject === "w2") {
      expandedLocation = WEARABLE_LOCATION.WRIST2;
    }
    if (
      parsedCommand.indirectObject &&
      WEARABLE_LOCATION_VALUES.some((location) =>
        location.startsWith(parsedCommand.indirectObject as string)
      )
    ) {
      expandedLocation = WEARABLE_LOCATION_VALUES.find((location) =>
        location.startsWith(parsedCommand.indirectObject as string)
      );
    }
    console.log(`specified location (expanded): ${expandedLocation}`);

    // Fail if user provided a valid location, but the item doesn't fit there
    if (
      expandedLocation &&
      !locationsItemIsWearable.some((location) => location === expandedLocation)
    ) {
      messageToUsername(
        user.username,
        `Sadly, ${item.name} isn't meant to be worn there.`,
        `rejection`
      );
      return;
    }

    //for each property in user.equipped, if the value is null, push the key into locationsUserHasEmpty as a string
    const locationsUserHasEmpty: string[] = WEARABLE_LOCATION_VALUES.filter(
      (location) => !user.equipped[location as keyof IEquipped]
    );
    console.log(`user has empty locations:`);
    console.log(locationsUserHasEmpty);

    // TODO if the user has specified a valid and compatible location, go ahead and equip the item there
    
    // TODO if the user didn't specify, equip the item on the first empty compatible slot
        // Assign a value to expandedLocation if it wasn't provided in the command
        if (!expandedLocation) {
          expandedLocation = locationsItemIsWearable[0];
          console.log(`expanded location auto-assigned: ${expandedLocation}`);
        }
    // TODO if no slots are empty, unequip the first compatible slot and equip the item there

  } catch (error: unknown) {
    catchErrorHandlerForFunction(`wear`, error, user?.name);
  }
}

// returns true if the item's level, job and spirit requirements are met by the user
function checkItemCompatibilityWithUser(user: IUser, item: IItem): boolean {
  try {
    // fail if user's level isn't high enough
    if (user.level < item.minimumLevel) {
      messageToUsername(
        user.username,
        `You need to be at least level ${item.minimumLevel} to use this item.`,
        `rejection`,
        true
      );
      return false;
    }

    // fail if user's job isn't compatible with the item
    if (
      (user.job === "cleric" && !item.tags.cleric) ||
      (user.job === "mage" && !item.tags.mage) ||
      (user.job === "rogue" && !item.tags.rogue) ||
      (user.job === "warrior" && !item.tags.warrior)
    ) {
      messageToUsername(
        user.username,
        `Sadly, ${item.name} can't be worn by ${user.job}s.`,
        `rejection`,
        false
      );
      return false;
    }

    // fail if the users's spirit is incompatible with the item
    if (user.statBlock.spirit > -333 && !item.tags.moon) {
      messageToUsername(
        user.username,
        `Your spirit is too moon-aligned to wear ${item.name}.`,
        `rejection`,
        false
      );
      return false;
    }
    if (
      user.statBlock.spirit > -333 &&
      user.statBlock.spirit < 333 &&
      !item.tags.neutral
    ) {
      messageToUsername(
        user.username,
        `Your spirit is too neutral to wear ${item.name}.`,
        `rejection`,
        false
      );
      return false;
    }
    if (user.statBlock.spirit > 333 && !item.tags.sun) {
      messageToUsername(
        user.username,
        `Your spirit is too sun-aligned to wear ${item.name}.`,
        `rejection`,
        false
      );
      return false;
    }

    return true;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(
      `checkItemCompatibilityWithUser`,
      error,
      user?.name
    );
    return false;
  }
}

export default wear;
