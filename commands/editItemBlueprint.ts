// editItemBlueprint
// processes and saves data from edit_item_blueprint user submission
import mongoose from "mongoose";
import logger from "../logger.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import truncateDescription from "../util/truncateDescription.js";
import { IAffix } from "../model/classes/Affix.js";
import { IItemNode } from "../model/classes/ItemNode.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";

export interface IEditItemBlueprintFormData {
  name: string;
  keywords: string[];
  price: number;
  minimumLevel: number;
  itemType: string;
  weaponStats?: {
    damageDieQuantity: number;
    damageDieSides: number;
    damageType: string;
    isFinesse: boolean;
    isLight: boolean;
    isReach: boolean;
    isRanged: boolean;
    isTwohand: boolean;
  };
  spellCharges?: {
    name: string;
    level: number;
    maxCharges: number;
  };
  description: {
    look: string;
    examine: string;
    study: string;
    research: string;
  };
  tags: {
    cleric: boolean;
    mage: boolean;
    rogue: boolean;
    warrior: boolean;
    dark: boolean;
    neutral: boolean;
    light: boolean; //can be equipped by players with a light aura
    guild: boolean;
    food: boolean;
    lamp: boolean; //lights up the room
    hidden: boolean;
    fixture: boolean;
    quest: boolean;
    temporary: boolean;
    container: boolean;
  };
  wearableLocations?: {
    head: boolean;
    ears: boolean;
    neck: boolean;
    shoulders: boolean;
    body: boolean;
    arms: boolean;
    wrist1: boolean;
    wrist2: boolean;
    hands: boolean;
    finger1: boolean;
    finger2: boolean;
    waist: boolean;
    legs: boolean;
    feet: boolean;
    shield: boolean;
  };
  itemNodes?: Array<IItemNode>;
  affixes?: Array<IAffix>;
}

async function editItemBlueprint(
  itemId: mongoose.Types.ObjectId,
  formData: IEditItemBlueprintFormData,
  user: IUser
) {
  try {
    if (!itemId) throw new Error("Missing itemId");
    if (!formData) throw new Error("Missing formData");
    if (!user) throw new Error("Missing user");

    //get existing item data
    const zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error(
        `editItemBlueprint couldn't find zone to save for user ${user.username}'s location.`
      );
    }

    const item = zone.itemBlueprints.find(
      (blueprint) => blueprint._id.toString() === itemId.toString()
    );
    if (!item) {
      throw new Error(
        `editItemBlueprint couldn't find item with id ${itemId} in ${zone.name}`
      );
    }

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
    if (
      (formData.itemType === "potion" ||
        formData.itemType === "scroll" ||
        formData.itemType === "wand" ||
        formData.tags.food) &&
      formData.spellCharges
    ) {
      item.spellCharges = formData.spellCharges;
    }
    item.description = formData.description;
    item.tags = formData.tags;
    if (formData.itemType === "armor" && formData.wearableLocations) {
      item.wearableLocations = formData.wearableLocations;
    }
    item.history.modifiedDate = new Date();

    if (formData.tags.container && (item.capacity === 0 || !item.capacity)) {
      logger.debug(
        `editItemBlueprint: setting capacity to 10 (item is a container without capacity)`
      );
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
            loadsBlueprintId: new mongoose.Types.ObjectId(
              node.loadsBlueprintId
            ),
            fromZoneId: zone._id,
          });
        }
      });
    }

    if (
      formData.affixes &&
      (formData.itemType === "armor" || formData.itemType === "weapon")
    ) {
      item.affixes = formData.affixes;
    }

    if (
      formData.tags.food &&
      (formData.spellCharges?.name === "none" || !formData.spellCharges)
    ) {
      delete item.spellCharges;
    }

    await zone.save();
    await zone.initRooms();

    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(`success`, `Item updated!`)
    );
  } catch (error: unknown) {
    catchErrorHandlerForFunction("editItemBlueprint", error, user.name)
  }
}

export default editItemBlueprint;
