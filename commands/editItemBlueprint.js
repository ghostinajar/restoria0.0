// editItemBlueprint
import mongoose from "mongoose";
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import truncateDescription from "../util/truncateDescription.js";
async function editItemBlueprint(itemId, formData, user) {
    logger.debug(`editItemBlueprint submitted by user ${user.name} for item id: ${itemId.toString()}`);
    if (!itemId || !formData || !user) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejected`, `Oops! Can't seem to edit this item.`));
        return;
    }
    //get existing item data
    const zone = await getZoneOfUser(user);
    if (!zone) {
        logger.error(`editItemBlueprint couldn't find zone to save for user ${user.username}'s location.}`);
        return;
    }
    // logger.debug(
    //   `editItemBlueprint finding ${itemId} in ${zone.itemBlueprints.map(
    //     (blueprint) => blueprint._id
    //   )}`
    // );
    const item = zone.itemBlueprints.find((blueprint) => blueprint._id.toString() === itemId.toString());
    if (!item) {
        logger.error(`editItemBlueprint couldn't find item with id ${itemId} in ${zone.name}`);
        return;
    }
    // logger.debug(`editItemBlueprint found a match! ${item.name}`);
    //coerce formData property values to correct types
    formData.price = Number(formData.price);
    truncateDescription(formData.description, user);
    //update values and save zone
    item.name = formData.name;
    item.keywords = formData.keywords;
    item.price = formData.price;
    item.minimumLevel = formData.minimumLevel;
    item.itemType = formData.itemType;
    if (formData.itemType === "weapon" && formData.weaponStats) {
        item.weaponStats = formData.weaponStats;
    }
    if ((formData.itemType === "potion" ||
        formData.itemType === "scroll" ||
        formData.itemType === "wand" ||
        formData.tags.food) &&
        formData.spellCharges) {
        item.spellCharges = formData.spellCharges;
    }
    item.description = formData.description;
    item.tags = formData.tags;
    if (formData.itemType === "armor" && formData.wearableLocations) {
        item.wearableLocations = formData.wearableLocations;
    }
    item.history.modifiedDate = new Date();
    if (formData.tags.container && (item.capacity === 0 || !item.capacity)) {
        logger.debug(`editItemBlueprint: setting capacity to 10 (item is a container without capacity)`);
        item.capacity = 10;
        item.itemNodes = [];
    }
    //clear room.itemNodes and replace with processed roomData.itemNodes
    if (formData.tags.container && formData.itemNodes) {
        item.itemNodes = [];
        formData.itemNodes.forEach((node) => {
            if (item.itemNodes) {
                item.itemNodes.push({
                    _id: new mongoose.Types.ObjectId(),
                    loadsBlueprintId: new mongoose.Types.ObjectId(node.blueprintId),
                    fromZoneId: zone._id,
                });
            }
        });
    }
    if (formData.affixes &&
        (formData.itemType === "armor" || formData.itemType === "weapon")) {
        item.affixes = formData.affixes;
    }
    if (formData.tags.food && (formData.spellCharges?.name === "none" || !formData.spellCharges)) {
        delete item.spellCharges;
    }
    await zone.save();
    await zone.initRooms();
    worldEmitter.emit(`messageFor${user.username}`, makeMessage(`success`, `Item updated!`));
}
export default editItemBlueprint;
