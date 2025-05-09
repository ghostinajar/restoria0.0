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
import putNumberInRange from "../util/putNumberInRange.js";
import messageToUsername from "../util/messageToUsername.js";
import { DEFAULT_WEARABLE_LOCATIONS } from "../constants/WEARABLE_LOCATION.js";

export interface IEditItemBlueprintFormData {
  _id: mongoose.Types.ObjectId;
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
    moon: boolean;
    neutral: boolean;
    sun: boolean;
    guild: boolean;
    food: boolean;
    lamp: boolean;
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
  capacity: number;
}

async function editItemBlueprint(
  formData: IEditItemBlueprintFormData,
  user: IUser
) {
  try {
    //get existing item data
    const zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error(
        `editItemBlueprint couldn't find zone to save for user ${user.username}'s location.`
      );
    }
    if (user._id.toString() !== zone.author.toString()) {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage(
          `rejection`,
          `Tsk, you aren't an author of this zone. GOTO one of your own and EDIT there.`
        )
      );
      return;
    }

    const item = zone.itemBlueprints.find(
      (blueprint) => blueprint._id.toString() === formData._id.toString()
    );
    if (!item) {
      throw new Error(
        `editItemBlueprint couldn't find item with id ${formData._id} in ${zone.name}`
      );
    }

    //coerce formData property values to correct types
    formData.price = Number(formData.price);
    truncateDescription(formData.description, user);

    //update values and save zone
    item.name = formData.name;
    item.keywords = formData.keywords;
    item.price = putNumberInRange(0, 100000, formData.price, user);
    item.minimumLevel = putNumberInRange(0, 31, formData.minimumLevel, user);
    item.itemType = formData.itemType;
    if (formData.itemType === "weapon" && formData.weaponStats) {
      formData.weaponStats.damageDieQuantity = putNumberInRange(
        1,
        9,
        formData.weaponStats.damageDieQuantity,
        user
      );
      formData.weaponStats.damageDieSides = putNumberInRange(
        1,
        12,
        formData.weaponStats.damageDieSides,
        user
      );
      item.weaponStats = formData.weaponStats;
    }
    if (
      (formData.itemType === "potion" ||
        formData.itemType === "scroll" ||
        formData.itemType === "wand" ||
        formData.tags.food) &&
      formData.spellCharges
    ) {
      formData.spellCharges.level = putNumberInRange(
        1,
        31,
        formData.spellCharges.level,
        user
      );
      formData.spellCharges.maxCharges = putNumberInRange(
        1,
        20,
        formData.spellCharges.maxCharges,
        user
      );
      item.spellCharges = formData.spellCharges;
    }
    item.description = formData.description;
    item.tags = formData.tags;
    if (formData.itemType === "armor" && formData.wearableLocations) {
      if (
        Object.values(formData.wearableLocations).some((location) => location)
      ) {
        item.wearableLocations = formData.wearableLocations;
      } else {
        item.wearableLocations = {...DEFAULT_WEARABLE_LOCATIONS};
        messageToUsername(
          user.username,
          `Since ${item.name} is armor, it has to be wearable somewhere.`,
          `info`
        );
        messageToUsername(
          user.username,
          `For now, we'll make it wearable on the hands.`,
          `info`
        );
      }
    }
    item.history.modifiedDate = new Date();

    if (formData.tags.container && (item.capacity === 0 || !item.capacity)) {
      logger.debug(
        `editItemBlueprint: setting capacity to 10 (item is a container without capacity)`
      );
      item.capacity = 10;
      item.itemNodes = [];
    }

    if (formData.tags.container && formData.capacity) {
      item.capacity = putNumberInRange(1, 200, formData.capacity, user);
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
    catchErrorHandlerForFunction("editItemBlueprint", error, user.name);
  }
}

export default editItemBlueprint;
