// relocateItem
// copies a game object (IITem) to destination inventory (IItem[]) and removes from origin inventory
import { IItem } from "../model/classes/Item.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

async function relocateItem(
  item: IItem,
  originInventory: IItem[],
  destinationInventory: IItem[]
) {
  try {
    destinationInventory.push(item);
    originInventory.splice(originInventory.indexOf(item), 1);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`relocateItem`, error);
  }
}

export default relocateItem;
