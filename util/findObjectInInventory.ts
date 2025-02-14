// findObjectInInventory
// utility function to find IItem object by keyword from any inventory (an array of IItem ojects), returns the object or undefined

import { IItem } from "../model/classes/Item.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

async function findObjectInInventory(
  inventory: IItem[],
  objectKeyword: string,
  objectOrdinal?: number | "all"
): Promise<IItem | undefined> {
  try {
    // find eligible matches
    const filteredInventory = inventory.filter((item) =>
      item.keywords.some((keyword) => keyword.includes(objectKeyword))
    );

    let foundObject: IItem | undefined;

    if (
      objectOrdinal !== undefined &&
      objectOrdinal !== "all" &&
      objectOrdinal < filteredInventory.length
    ) {
      foundObject = filteredInventory[objectOrdinal];
    } else {
      foundObject = filteredInventory[0];
    }

    return foundObject;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`findObjectInInventory.ts:`, error);
  }
}

export default findObjectInInventory;
