// unequip
// remove an item from the user's equipped items

import { IItem } from "../model/classes/Item.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";
import { IParsedCommand } from "../util/parseCommand.js";

async function unequip(
  parsedCommand: IParsedCommand,
  user: IUser,
  item?: IItem,
  location?: string
) {
  try {
    // handle a direct call with item and ?location specified
    if (item && location) {
      console.log(`unequiping ${user.name}'s ${item?.name} from ${location}`);
      user.inventory.push(item);
      user.equipped[location as keyof IUser["equipped"]] = null;
      messageToUsername(
        user.username,
        `You unequipped ${item.name}.`,
        `itemIsHere`
      );
      console.log(`${user.name}'s ${location} now holds ${user.equipped[location as keyof IUser["equipped"]]}`);
    }

    // handle a call with parsedCommand from the user

  } catch (error: unknown) {
    catchErrorHandlerForFunction(`unequip`, error, user?.name);
  }
}

export default unequip;
