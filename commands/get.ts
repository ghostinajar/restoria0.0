// get
// user can get objects from the ground or from containers
import { IItem } from "../model/classes/Item.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import findObjectInInventory from "../util/findObjectInInventory.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import messageToUsername from "../util/messageToUsername.js";
import relocateItem from "../util/relocateItem.js";
import { IParsedCommand } from "../util/parseCommand.js";
import save from "./save.js";
import messageMissingTargetToUser from "../util/messageMissingTargetToUser.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";

async function get(parsedCommand: IParsedCommand, user: IUser) {
  try {
    // fail if user inventory is full
    if (user.inventory.length >= user.capacity) {
      messageToUsername(
        user.username,
        `You can't get anything while your INVENTORY is full. Try DROP or GIVE to make space.`,
        `help`
      );
      return;
    }

    // fail if item not specified
    let specifiedItemKeyword = parsedCommand.directObject;
    if (!specifiedItemKeyword) {
      messageToUsername(user.username, `What do you want to get?`, `help`);
      return;
    }

    let specifiedContainerKeyword =
      parsedCommand.indirectObject || "the ground";
    let room = await getRoomOfUser(user);
    if (!room) {
      throw new Error(`Room not found for user ${user.name}.`);
    }

    // handle direct get (from room inventory)
    if (specifiedContainerKeyword === "the ground") {
      let itemToGet = await findObjectInInventory(
        room.inventory,
        specifiedItemKeyword,
        parsedCommand.directObjectOrdinal
      );
      if (!itemToGet) {
        messageMissingTargetToUser(user, specifiedItemKeyword);
        return;
      }
      // handle "all"
      if (parsedCommand.targetsAll) {
        let itemsToGet = room.inventory.filter((item) =>
          item.keywords.some((keyword) =>
            keyword.startsWith(specifiedItemKeyword)
          )
        );
        if (!itemsToGet) {
          messageMissingTargetToUser(user, specifiedItemKeyword);
          return;
        }
        itemsToGet.forEach(async (itemToGet) => {
          if (itemToGet.tags.fixture) {
            messageToUsername(
              user.username,
              `You can't get ${itemToGet.name}, because it's fixed in place.`,
              `help`
            );
            return;
          }
          await relocateItem(itemToGet, room.inventory, user.inventory);
          messageToUsername(
            user.username,
            `You get ${itemToGet.name} from the ground.`,
            `success`
          );
        });
        worldEmitter.emit(
          `messageFor${user.username}sRoom`,
          makeMessage(
            `itemIsHere`,
            `${user.name} gets some items from the ground.`
          )
        );
      } else {
        //handle single object (directObjectOrdinal is an integer or unspecifed)

        // fail if item is a fixture
        if (itemToGet.tags.fixture) {
          messageToUsername(
            user.username,
            `You can't get ${itemToGet.name}, because it's fixed in place.`,
            `help`
          );
          return;
        }
        await relocateItem(itemToGet, room.inventory, user.inventory);
        messageToUsername(
          user.username,
          `You get ${itemToGet.name} from the ground.`,
          `success`
        );
        worldEmitter.emit(
          `messageFor${user.username}sRoom`,
          makeMessage(
            `itemIsHere`,
            `${user.name} gets ${itemToGet.name} from the ground.`
          )
        );
      }
      await save(user, true);
      return;
    }

    // handle get from container

    const userInventoryHasEligibleContainers = user.inventory.some(
      (container: IItem) =>
        container.keywords.some((keyword) =>
          keyword.toLowerCase().startsWith(specifiedContainerKeyword)
        )
    );
    const roomInventoryHasEligibleContainers = room.inventory.some(
      (container: IItem) =>
        container.keywords.some((keyword) =>
          keyword.toLowerCase().startsWith(specifiedContainerKeyword)
        )
    );
    const mobsHaveSpecifiedContainerKeywordAsKeyword = room.mobs.some((mob) =>
      mob.keywords.some((keyword) =>
        keyword.startsWith(specifiedContainerKeyword)
      )
    );
    const usersHaveSpecifiedContainerKeywordAsUsername = room.users.some(
      (user) => user.username.startsWith(specifiedContainerKeyword)
    );

    // fail if container only found in room.mobs
    if (
      !userInventoryHasEligibleContainers &&
      !roomInventoryHasEligibleContainers &&
      mobsHaveSpecifiedContainerKeywordAsKeyword
    ) {
      messageToUsername(
        user.username,
        `You can't GET from a mob. A rogue could try to STEAL it...`,
        `help`
      );
      return;
    }

    // fail if container only found in room.users
    if (
      !userInventoryHasEligibleContainers &&
      !roomInventoryHasEligibleContainers &&
      usersHaveSpecifiedContainerKeywordAsUsername
    ) {
      messageToUsername(
        user.username,
        `You can't GET a player's items. You could ask them to GIVE it...`,
        `help`
      );
      return;
    }

    // fail if container not found anywhere
    function failToFindContainer(username: string, itemName: string) {
      messageToUsername(
        username,
        `You can't seem to find the ${itemName} to get it from.`,
        `help`
      );
    }
    if (
      !userInventoryHasEligibleContainers &&
      !roomInventoryHasEligibleContainers &&
      !usersHaveSpecifiedContainerKeywordAsUsername &&
      !mobsHaveSpecifiedContainerKeywordAsKeyword
    ) {
      failToFindContainer(user.username, specifiedContainerKeyword);
      return;
    }

    // fail if container specified but not found by ordinal
    let originInventory: IItem[] | undefined;
    let originContainer: IItem | undefined;
    if (userInventoryHasEligibleContainers) {
      originContainer = await findObjectInInventory(
        user.inventory,
        specifiedContainerKeyword,
        parsedCommand.indirectObjectOrdinal
      );
      if (originContainer) {
        originInventory = originContainer.inventory;
      }
    }
    if (!originInventory && roomInventoryHasEligibleContainers) {
      originContainer = await findObjectInInventory(
        room.inventory,
        specifiedContainerKeyword,
        parsedCommand.indirectObjectOrdinal
      );
      if (originContainer) {
        originInventory = originContainer.inventory;
      }
    }
    if (!originInventory) {
      failToFindContainer(user.username, specifiedContainerKeyword);
      return;
    }
    if (!originContainer) {
      return;
    }

    // fail if item not found in container
    let itemToGet = await findObjectInInventory(
      originInventory,
      specifiedItemKeyword,
      parsedCommand.directObjectOrdinal
    );
    if (!itemToGet) {
      messageMissingTargetToUser(user, specifiedItemKeyword);
      return;
    }

    // success!
    // move item from container to user inventory
    if (parsedCommand.targetsAll) {
      // handle get all
      let itemsToGet = originInventory.filter((item) =>
        item.keywords.some((keyword) =>
          keyword.startsWith(specifiedItemKeyword)
        )
      );
      if (!itemsToGet) {
        messageMissingTargetToUser(user, specifiedItemKeyword);
        return;
      }
      itemsToGet.forEach(async (itemToGet) => {
        if (itemToGet.tags.fixture) {
          messageToUsername(
            user.username,
            `You can't get ${itemToGet.name}, because it's fixed in place.`,
            `help`
          );
          return;
        }
        await relocateItem(itemToGet, originInventory, user.inventory);
        messageToUsername(
          user.username,
          `You get ${itemToGet.name} from ${originContainer.name}.`,
          `success`
        );
      });
      worldEmitter.emit(
        `messageFor${user.username}sRoom`,
        makeMessage(
          `itemIsHere`,
          `${user.name} gets some items from ${originContainer.name}.`
        )
      );
    } else {
      // handle get single object
      await relocateItem(itemToGet, originInventory, user.inventory);
      messageToUsername(
        user.username,
        `You get ${itemToGet.name} from ${originContainer.name}.`,
        `success`
      );
      worldEmitter.emit(
        `messageFor${user.username}sRoom`,
        makeMessage(
          `itemIsHere`,
          `${user.name} gets ${itemToGet.name} from ${originContainer.name}.`
        )
      );
    }

    await save(user, true);
    return;
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`get`, error, user?.name);
  }
}

export default get;
