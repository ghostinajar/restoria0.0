// getEquippedItems
// returns an array with all the items equipped on a user or mob

import { WEARABLE_LOCATION_VALUES } from "../constants/WEARABLE_LOCATION.js";
import { IItem } from "../model/classes/Item.js";
import { IMob } from "../model/classes/Mob.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

function getEquippedItems(agent: IUser | IMob) {
  try {
    let eqAndWeapons = [...WEARABLE_LOCATION_VALUES, "weapon1", "weapon2"];
    let equipmentArray: Array<IItem> = [];
    eqAndWeapons.forEach((location) => {
      let itemInSlot = agent.equipped[location as keyof IUser["equipped"]];
      if (itemInSlot) {
        equipmentArray.push(itemInSlot);
      }
    });
    return equipmentArray;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`getEquippedItems`, error);
    return [];
  }
}

export default getEquippedItems;
