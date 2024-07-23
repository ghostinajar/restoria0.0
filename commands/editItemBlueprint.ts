// editItemBlueprint
import mongoose from "mongoose";
import logger from "../logger.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import truncateDescription from "../util/truncateDescription.js";
import { IItemBlueprintData } from "./createItemBlueprint.js";

async function editItemBlueprint(
  itemId: mongoose.Types.ObjectId,
  formData: IItemBlueprintData,
  user: IUser
) {
  logger.debug(
    `editItemBlueprint submitted by user ${
      user.name
    } for item id: ${itemId.toString()}`
  );
  if (!itemId || !formData || !user) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(`rejected`, `Oops! Can't seem to edit this item.`)
    );
    return;
  }

  //get existing item data
  const zone = await getZoneOfUser(user);
  if (!zone) {
    logger.error(
      `editItemBlueprint couldn't find zone to save for user ${user.username}'s location.}`
    );
    return;
  }
  logger.debug(
    `editItemBlueprint finding ${itemId} in ${zone.itemBlueprints.map(
      (blueprint) => blueprint._id
    )}`
  );
  const item = zone.itemBlueprints.find(
    (blueprint) => blueprint._id.toString() === itemId.toString()
  );
  if (!item) {
    logger.error(
      `editItemBlueprint couldn't find item with id ${itemId} in ${zone.name}`
    );
    return;
  }
  logger.debug(`editItemBlueprint found a match! ${item.name}`);

  //coerce formData property values to correct types
  formData.price = Number(formData.price);
  truncateDescription(formData.description, user);

  //update values and save zone
  item.name = formData.name;
  item.keywords = formData.keywords;
  item.description = formData.description;
  item.price = formData.price;
  item.minimumLevel = formData.minimumLevel;
  item.tags.container = formData.isContainer;
  item.history.modifiedDate = new Date();

  if (formData.isContainer && item.capacity === 0) {
    logger.debug(`editItemBlueprint: setting capacity to 10 (item is a container without capacity)`)
    item.capacity = 10;
  }

  await zone.save();
  await zone.initRooms();

  worldEmitter.emit(
    `messageFor${user.username}`,
    makeMessage(`success`, `Item updated!`)
  );
}

export default editItemBlueprint;
