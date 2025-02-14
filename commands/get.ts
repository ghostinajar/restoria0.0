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

async function get(parsedCommand: IParsedCommand, user: IUser) {
  try {
    // fail if item not specified
    let specifiedItem = parsedCommand.directObject;
    if (!specifiedItem) {
      console.log("messaging user");
      messageToUsername(user.username, `What do you want to get?`, `help`);
      return;
    }

    // fail if container not specified and object not found in room.inventory
    let specifiedContainer = parsedCommand.indirectObject;
    let room = await getRoomOfUser(user);
    if (!room) {
      throw new Error(`Room not found for user ${user.name}.`);
    }
    function failToFindItem(username: string, itemName: string) {
      messageToUsername(
        username,
        `You can't seem to find the ${itemName}.`,
        `help`
      );
    }
    if (
      !specifiedContainer &&
      !room.inventory.some((item: IItem) =>
        item.keywords.some((keyword) => keyword.toLowerCase() === specifiedItem)
      )
    ) {
      failToFindItem(user.username, specifiedItem);
      return;
    }

    // fail if container specified but only found in room.mobs
    let userInventoryHasEligibleContainers = user.inventory.some(
      (container: IItem) =>
        container.keywords.some(
          (keyword) => keyword.toLowerCase() === specifiedContainer
        )
    );

    let roomInventoryHasEligibleContainers = room.inventory.some(
      (container: IItem) =>
        container.keywords.some(
          (keyword) => keyword.toLowerCase() === specifiedContainer
        )
    );
    let mobsHaveSpecifiedContainerAsKeyword = false;
    if (specifiedContainer) {
      mobsHaveSpecifiedContainerAsKeyword = room.mobs.some((mob) =>
        mob.keywords.includes(specifiedContainer)
      );
    }
    if (
      specifiedContainer &&
      !userInventoryHasEligibleContainers &&
      !roomInventoryHasEligibleContainers &&
      mobsHaveSpecifiedContainerAsKeyword
    ) {
      messageToUsername(
        user.username,
        `You can't GET from a mob. A rogue could try to STEAL it...`,
        `help`
      );
      return;
    }

    // fail if container specified but only found in room.users
    let usersHaveSpecifiedContainerAsUsername = false;
    if (specifiedContainer) {
      usersHaveSpecifiedContainerAsUsername = room.users.some(
        (user) => user.username === specifiedContainer
      );
    }
    if (
      specifiedContainer &&
      !userInventoryHasEligibleContainers &&
      !roomInventoryHasEligibleContainers &&
      usersHaveSpecifiedContainerAsUsername
    ) {
      messageToUsername(
        user.username,
        `You can't GET a player's items. You could ask them to GIVE it...`,
        `help`
      );
      return;
    }

    // fail if container specified but not found anywhere
    function failToFindContainer(username: string, itemName: string) {
      messageToUsername(
        username,
        `You can't seem to find the ${specifiedContainer} to get it from.`,
        `help`
      );
    }
    if (
      specifiedContainer &&
      !userInventoryHasEligibleContainers &&
      !roomInventoryHasEligibleContainers &&
      !usersHaveSpecifiedContainerAsUsername &&
      !mobsHaveSpecifiedContainerAsKeyword
    ) {
      failToFindContainer(user.username, specifiedContainer);
      return;
    }
    // fail if container specified but not found by ordinal
    let originInventory: IItem[] | undefined;
    if (userInventoryHasEligibleContainers) {
      let originContainer = await findObjectInInventory(
        user.inventory,
        specifiedContainer as string,
        parsedCommand.indirectObjectOrdinal
      );
      originInventory = originContainer?.inventory;
    }
    if (!originInventory && roomInventoryHasEligibleContainers) {
      let originContainer = await findObjectInInventory(
        room.inventory,
        specifiedContainer as string,
        parsedCommand.indirectObjectOrdinal
      );
      originInventory = originContainer?.inventory;
    }
    if (!originInventory) {
      failToFindContainer(user.username, specifiedContainer as string);
      return;
    }

    // fail if item not found in container
    let itemToGet = await findObjectInInventory(
      originInventory,
      specifiedItem,
      parsedCommand.directObjectOrdinal
    );
    if (!itemToGet) {
      failToFindItem(user.username, specifiedItem);
      return;
    }

    // move item from container to user inventory
    relocateItem(itemToGet, originInventory, user.inventory);
    messageToUsername(user.username, `You got ${itemToGet.name}.`, `success`);
    console.log(user.inventory.map((item) => item.name));
    // await user.save();
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`get`, error, user?.name);
  }
}

export default get;
