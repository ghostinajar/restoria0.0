// equipment
// shows user equipment items

import { WEARABLE_LOCATION_VALUES } from "../constants/WEARABLE_LOCATION.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";
import { IParsedCommand } from "../util/parseCommand.js";

async function equipment(parsedCommand: IParsedCommand, user: IUser) {
  try {
    let equipmentArray: Array<[string, string]> = [];
    WEARABLE_LOCATION_VALUES.forEach((location) => {
      let itemInSlot = user.equipped[location as keyof IUser["equipped"]];
      let arrayItem: [string, string];
      if (itemInSlot) {
        arrayItem = [
          `${location.charAt(0).toUpperCase() + location.slice(1).padEnd(9,` `)}`, 
          `${itemInSlot.name}`
        ];
      } else {
        arrayItem = [`${location.charAt(0).toUpperCase() + location.slice(1).padEnd(9,` `)}`, `nothing`];
      }
      equipmentArray.push(arrayItem);
    });
    console.log(equipmentArray);
    messageToUsername(user.username, `You're equipped with:`, `success`);
    worldEmitter.emit(`equipmentArrayFor${user.username}`, equipmentArray);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`equipped`, error, user?.name);
  }
}

export default equipment;
