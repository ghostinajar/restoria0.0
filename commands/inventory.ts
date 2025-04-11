// inventory
// shows a user the items in their inventory

import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import IMessage from "../types/Message.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import makeMessage from "../util/makeMessage.js";
import messageToUsername from "../util/messageToUsername.js";

async function inventory(user: IUser) {
  try {
    if (user.inventory.length === 0) {
      messageToUsername(
        user.username,
        `You're not carrying anything.`,
        `failure`,
        true
      );
      return;
    }

    // start counting the number of each item in the inventory
    const itemCounts: Record<string, { name: string; count: number }> = {};

    // Loop through the inventory and count items by their blueprint ID
    for (const item of user.inventory) {
      const blueprintKey = item.itemBlueprint.toString(); // Use the blueprint ID as the key
      if (!itemCounts[blueprintKey]) {
        itemCounts[blueprintKey] = { name: item.name, count: 0 };
      }
      itemCounts[blueprintKey].count++;
    }

    // generate strings for the inventory items
    const inventoryStrings = Object.values(itemCounts).map((item) =>
      item.count > 1 ? `${item.name} (${item.count})` : item.name
    );

    // create and send the message array
    const inventoryMessageArray: Array<IMessage> = [];
    const inventoryTitle = `Your Inventory:`;
    inventoryMessageArray.push(makeMessage(`help`, inventoryTitle));
    inventoryStrings.forEach((itemString) => {
      inventoryMessageArray.push(makeMessage(`itemIsHere`, `  ${itemString}`));
    });
    inventoryMessageArray.push(
      makeMessage(
        `help`,
        `You're holding ${user.inventory.length}/${user.capacity} items.`
      )
    );
    worldEmitter.emit(`messageArrayFor${user.username}`, inventoryMessageArray);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`inventory`, error, user?.name);
  }
}

export default inventory;
