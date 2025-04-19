// findObjectInInventory
// utility function to find IItem object by keyword from any inventory (an array of IItem ojects), returns the object or undefined

import { IItem } from "../model/classes/Item.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

function findObjectInInventory(
  inventory: IItem[],
  objectKeyword: string,
  objectOrdinal?: number | "all" | undefined
): IItem | undefined {
  try {
    // find eligible matches
    const filteredInventory = inventory.filter((item) =>
      item.keywords.some((keyword) =>
        keyword.toLowerCase().startsWith(objectKeyword)
      )
    );

    let foundObject: IItem | undefined;

    if (objectOrdinal !== undefined && objectOrdinal !== "all") {
      // Check if the requested ordinal exists in the filtered inventory
      foundObject =
        objectOrdinal < filteredInventory.length
          ? filteredInventory[objectOrdinal]
          : undefined;
    } else {
      // If no ordinal specified or "all" requested, return first match if any
      foundObject = filteredInventory[0];
    }

    return foundObject;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`findObjectInInventory.ts:`, error);
  }
}

export default findObjectInInventory;
