// createItemBlueprint
// saves incoming data from create_item_blueprint_form user submission
import makeMessage from "../util/makeMessage.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import mongoose from "mongoose";
import truncateDescription from "../util/truncateDescription.js";
import look from "./look.js";
import DAMAGE_TYPE from "../constants/DAMAGE_TYPE.js";
import ITEM_TYPE from "../constants/ITEM_TYPE.js";
import SPELL from "../constants/SPELL.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import { historyStartingNow } from "../model/classes/History.js";
async function createItemBlueprint(itemFormData, user) {
    try {
        // logger.debug(`Trying to create item blueprint ${itemFormData.name}.`);
        let zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`Couldn't find user's zone!`);
        }
        const itemDescription = {
            look: itemFormData.description.look,
            examine: itemFormData.description.examine,
            study: itemFormData.description.study,
            research: itemFormData.description.research,
        };
        truncateDescription(itemDescription, user);
        const newItemBlueprint = {
            _id: new mongoose.Types.ObjectId(),
            author: user._id,
            name: itemFormData.name,
            itemType: itemFormData.itemType,
            price: itemFormData.price,
            capacity: 0,
            minimumLevel: itemFormData.minimumLevel,
            history: historyStartingNow(),
            description: itemDescription,
            tags: itemFormData.tags,
            keywords: itemFormData.keywords,
            tweakDuration: 182,
        };
        // logger.debug(`createItemBlueprint made newItemBlueprint: ${JSON.stringify(newItemBlueprint)}`);
        if (itemFormData.tags.container) {
            newItemBlueprint.capacity = 10;
        }
        if (itemFormData.itemType === ITEM_TYPE.ARMOR) {
            newItemBlueprint.wearableLocations = {
                head: false,
                ears: false,
                neck: false,
                shoulders: false,
                body: false,
                arms: false,
                wrist1: false,
                wrist2: false,
                hands: false,
                finger1: false,
                finger2: false,
                waist: false,
                legs: false,
                feet: false,
                shield: false,
            };
        }
        if (itemFormData.itemType === ITEM_TYPE.POTION ||
            itemFormData.itemType === ITEM_TYPE.SCROLL ||
            itemFormData.itemType === ITEM_TYPE.WAND) {
            newItemBlueprint.spellCharges = {
                name: SPELL.HEAL,
                level: 1,
                maxCharges: 1,
            };
        }
        if (itemFormData.itemType === ITEM_TYPE.WEAPON) {
            newItemBlueprint.weaponStats = {
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
        zone.itemBlueprints.push(newItemBlueprint);
        await zone.save();
        await zone.initRooms();
        // logger.debug(`Saved zone ${originZone.name} with item blueprints for ${originZone.itemBlueprints.map(item => item.name)}`)
        logger.info(`Author "${user.name}" created item blueprint "${newItemBlueprint.name}".`);
        worldEmitter.emit(`messageFor${user.username}`, makeMessage("success", `You made an item blueprint: ${newItemBlueprint.name}. Type EDIT ITEM to modify it, or EDIT ROOM to place one here.`));
        await look({ commandWord: "look" }, user);
    }
    catch (error) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage("rejection", `There was an error on our server. Ralu will have a look at it soon!`));
        if (error instanceof Error) {
            logger.error(`createItemBlueprint error for user ${user.username}: ${error.message}`);
        }
        else {
            logger.error(`createItemBlueprint error for user ${user.username}: ${error}`);
        }
    }
}
export default createItemBlueprint;
