import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import truncateDescription from "../util/truncateDescription.js";
import ITEM_TYPE from "../constants/ITEM_TYPE.js";
import SPELL from "../constants/SPELL.js";
import DAMAGE_TYPE from "../constants/DAMAGE_TYPE.js";
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
    logger.debug(`editItemBlueprint finding ${itemId} in ${zone.itemBlueprints.map((blueprint) => blueprint._id)}`);
    const item = zone.itemBlueprints.find((blueprint) => blueprint._id.toString() === itemId.toString());
    if (!item) {
        logger.error(`editItemBlueprint couldn't find item with id ${itemId} in ${zone.name}`);
        return;
    }
    logger.debug(`editItemBlueprint found a match! ${item.name}`);
    //coerce formData property values to correct types
    formData.price = Number(formData.price);
    truncateDescription(formData.description, user);
    //update values and save zone
    item.name = formData.name;
    item.itemType = formData.itemType;
    item.keywords = formData.keywords;
    item.description = formData.description;
    item.price = formData.price;
    item.minimumLevel = formData.minimumLevel;
    item.tags.container = formData.isContainer;
    item.history.modifiedDate = new Date();
    if (formData.isContainer && item.capacity === 0) {
        logger.debug(`editItemBlueprint: setting capacity to 10 (item is a container without capacity)`);
        item.capacity = 10;
    }
    // remove irrelevant tags etc
    if (formData.itemType !== "weapon" && "weaponStats" in item) {
        logger.debug(`editItemBlueprint: removing weaponStats (item isn't a weapon)`);
        delete item.weaponStats;
    }
    if (formData.itemType !== "armor") {
        logger.debug(`editItemBlueprint: removing wearableLocations (item isn't armor)`);
        if ("wearableLocations" in item) {
            delete item.wearableLocations;
        }
    }
    if (formData.itemType !== "wand" &&
        formData.itemType !== "scroll " &&
        formData.itemType !== "none" &&
        formData.itemType !== "armor") {
        logger.debug(`editItemBlueprint: removing spellCharges (item isn't wand|scroll|potion|armor)`);
        if ("spellCharges" in item) {
            delete item.spellCharges;
        }
    }
    if (formData.itemType !== "armor" && formData.itemType !== "none ") {
        logger.debug(`editItemBlueprint: removing container tag (itemType isn't armor|none)`);
        item.tags.container = false;
    }
    // add new tags etc
    if (formData.itemType === ITEM_TYPE.ARMOR) {
        if (!item.wearableLocations) {
            logger.debug(`editItemBlueprint: adding wearableLocations (item is armor)`);
            item.wearableLocations = [];
        }
    }
    if (formData.itemType === ITEM_TYPE.POTION ||
        formData.itemType === ITEM_TYPE.SCROLL ||
        formData.itemType === ITEM_TYPE.WAND) {
        if (!item.spellCharges) {
            logger.debug(`editItemBlueprint: adding spellCharges (item is potion/scroll/wand)`);
            item.spellCharges = {
                name: SPELL.HEAL,
                level: 1,
                maxCharges: 1,
            };
        }
    }
    if (formData.itemType === ITEM_TYPE.WEAPON) {
        logger.debug(`editItemBlueprint: item is a weapon`);
        if (!item.weaponStats) {
            logger.debug(`editItemBlueprint: adding weaponStats`);
            item.weaponStats = {
                damageDieSides: 6,
                damageDieQuantity: 1,
                damageType: DAMAGE_TYPE.BLUDGEONING,
                isFinesse: false,
                isLight: false,
                isReach: false,
                isRanged: false,
                isTwohand: false,
            };
        }
    }
    console.log(item);
    await zone.save();
    await zone.initRooms();
    worldEmitter.emit(`messageFor${user.username}`, makeMessage(`success`, `Item updated!`));
}
export default editItemBlueprint;
