// createItemBlueprint
import makeMessage from "../types/makeMessage.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import IMessage from "../types/Message.js";
import mongoose from "mongoose";
import { IUser } from "../model/classes/User.js";
import COMPLETION_STATUS from "../constants/COMPLETION_STATUS.js";
import { IZone } from "../model/classes/Zone.js";
import { IDescription } from "../model/classes/Description.js";
import truncateDescription from "../util/truncateDescription.js";
import { IItemBlueprint } from "../model/classes/ItemBlueprint.js";
import look from "./look.js";
import DAMAGE_TYPE from "../constants/DAMAGE_TYPE.js";
import ITEM_TYPE from "../constants/ITEM_TYPE.js";
import WEARABLE_LOCATION from "../constants/WEARABLE_LOCATION.js";
import SPELL from "../constants/SPELL.js";

export interface IItemBlueprintData {
  name: string;
  itemType: string;
  keywords: string[];
  description: {
    look: string;
    examine: string;
    study: string;
    research: string;
  };
  price: number;
  minimumLevel: number;
  isContainer: boolean;
}

// Return item blueprint, or a message explaining failure (if by author, emit message to their socket)
async function createItemBlueprint(
  itemFormData: IItemBlueprintData,
  author: IUser
): Promise<IItemBlueprint | IMessage> {
  try {
    let message = makeMessage("rejection", ``);

    // logger.debug(`Trying to create item blueprint ${itemFormData.name}.`);
    // let originRoom : IRoom = await getRoomOfUser(author);
    // if (!originRoom) {
    //   logger.error(`Couldn't find origin room to create room.`);
    // }

    // find originZone (to save item blueprint to)
    let originZone: IZone = await new Promise((resolve) => {
      worldEmitter.once(
        `zone${author.location.inZone.toString()}Loaded`,
        resolve
      );
      worldEmitter.emit(`zoneRequested`, author.location.inZone.toString());
    });
    if (!originZone) {
      logger.error(`Couldn't find origin zone to create room.`);
    }

    const itemDescription: IDescription = {
      look: itemFormData.description.look,
      examine: itemFormData.description.examine,
      study: itemFormData.description.study,
      research: itemFormData.description.research,
    };
    truncateDescription(itemDescription, author);

    const newItemBlueprint: IItemBlueprint = {
      _id: new mongoose.Types.ObjectId(),
      author: author._id,
      name: itemFormData.name,
      itemType: itemFormData.itemType,
      price: itemFormData.price,
      capacity: 0,
      minimumLevel: itemFormData.minimumLevel,
      history: {
        creationDate: new Date(),
        modifiedDate: new Date(),
        completionStatus: COMPLETION_STATUS.DRAFT,
      },
      description: itemFormData.description,
      tags: {
        cleric: true,
        container: itemFormData.isContainer,
        dark: true,
        dagger: false,
        fixture: false,
        food: false,
        guild: false,
        hidden: false,
        illuminates: false,
        light: true,
        mage: true,
        neutral: true,
        quest: false,
        offhand: false,
        reach: false,
        temporary: false,
        rogue: true,
        thrown: false,
        two_hand: false,
        warrior: true,
      },
      keywords: itemFormData.keywords,
      tweakDuration: 182,
    };
    // logger.debug(`createItemBlueprint made newItemBlueprint: ${JSON.stringify(newItemBlueprint)}`);

    if (itemFormData.isContainer) {
      newItemBlueprint.capacity = 10;
    }

    if (itemFormData.itemType === ITEM_TYPE.ARMOR) {
      newItemBlueprint.wearableLocations = [];
    }

    if (
      itemFormData.itemType === ITEM_TYPE.FISHING_ROD ||
      itemFormData.itemType === ITEM_TYPE.NONE ||
      itemFormData.itemType === ITEM_TYPE.KEY ||
      itemFormData.itemType === ITEM_TYPE.WAND
    ) {
      newItemBlueprint.wearableLocations = [WEARABLE_LOCATION.HELD];
    }

    if (
      itemFormData.itemType === ITEM_TYPE.POTION ||
      itemFormData.itemType === ITEM_TYPE.SCROLL ||
      itemFormData.itemType === ITEM_TYPE.WAND
    ) {
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
        isRanged: false,
      };
      newItemBlueprint.wearableLocations = [
        WEARABLE_LOCATION.WEAPON1,
        WEARABLE_LOCATION.WEAPON2,
      ];
    }

    originZone.itemBlueprints.push(newItemBlueprint);
    await originZone.save();
    await originZone.initRooms();
    // logger.debug(`Saved zone ${originZone.name} with item blueprints for ${originZone.itemBlueprints.map(item => item.name)}`)

    logger.info(
      `Author "${author.name}" created item blueprint "${newItemBlueprint.name}".`
    );
    message.type = "success";
    message.content = `You created a item blueprint for ${newItemBlueprint.name}. To use blueprints, type 'place item' or 'remove item'.`;
    worldEmitter.emit(`messageFor${author.username}`, message);
    await look({ commandWord: "look" }, author);
    return newItemBlueprint;
  } catch (error: any) {
    logger.error(`Error in createItemBlueprint: ${error.message} `);
    throw error;
  }
}

export default createItemBlueprint;
