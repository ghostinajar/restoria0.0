// put
// allows user to put items in containers

import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import findObjectInInventory from "../util/findObjectInInventory.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import messageMissingTargetToUser from "../util/messageMissingTargetToUser.js";
import messageToUsername from "../util/messageToUsername.js";
import { IParsedCommand } from "../util/parseCommand.js";
import relocateItem from "../util/relocateItem.js";
import selectTargetByOrdinal from "../util/selectTargetByOrdinal.js";

async function put(parsedCommand: IParsedCommand, user: IUser) {
  try {
    const itemKeyword = parsedCommand.directObject;
    const containerKeyword = parsedCommand.indirectObject;
    if (!itemKeyword || !containerKeyword) {
      handleMissingKeyword(user.username);
      return;
    }

    const room = await getRoomOfUser(user);
    if (!room) {
      throw new Error(`Room not found for user ${user.name}`);
    }

    // fail if container not found
    let container = selectTargetByOrdinal(
      parsedCommand.indirectObjectOrdinal || 0,
      containerKeyword,
      user.inventory
    );
    if (!container) {
      container = selectTargetByOrdinal(
        parsedCommand.indirectObjectOrdinal || 0,
        containerKeyword,
        room.inventory
      );
    }
    if (!container) {
      messageToUsername(
        user.username,
        `You couldn't find a ${containerKeyword} to put something in.`,
        "failure"
      );
      return;
    }

    // fail if container is full or not a container
    if (!container.inventory) {
      messageToUsername(
        user.username,
        `You can't put items in ${container.name}.`,
        "failure"
      );
      return;
    }
    if (container.inventory.length >= container.capacity) {
      messageToUsername(
        user.username,
        `There's no room to put items in ${container.name}.`,
        "failure"
      );
      return;
    }

    if (parsedCommand.targetsAll) {
      // handle "all"
      let itemsToPut = user.inventory.filter((item) =>
        item.keywords.some((keyword) => keyword.startsWith(itemKeyword))
      );
      if (!itemsToPut) {
        messageMissingTargetToUser(user, itemKeyword);
        return;
      }
      itemsToPut.forEach(async (itemToPut) => {
        if (
          container.inventory &&
          container.inventory.length < container.capacity
        ) {
          await relocateItem(itemToPut, user.inventory, container.inventory);
          messageToUsername(
            user.username,
            `You put ${itemToPut.name} in ${container.name}.`,
            `success`
          );
        } else {
          messageToUsername(
            user.username,
            `You couldn't fit ${itemToPut.name} in ${container.name}.`,
            "failure"
          );
        }
      });
    } else {
      // handle single object
      let itemToPut = await findObjectInInventory(
        user.inventory,
        itemKeyword,
        parsedCommand.directObjectOrdinal
      );
      if (!itemToPut) {
        messageMissingTargetToUser(user, itemKeyword);
        return;
      }
      await relocateItem(itemToPut, user.inventory, container.inventory);
      messageToUsername(
        user.username,
        `You put ${itemToPut.name} in ${container.name}.`,
        `success`
      );
    }
    await user.save();
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`put`, error, user?.name);
  }
}

async function handleMissingKeyword(username: string) {
  messageToUsername(username, "Put what in what? E.g. PUT APPLE BAG");
}

export default put;
