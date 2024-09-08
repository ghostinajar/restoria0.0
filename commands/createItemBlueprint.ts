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
import SPELL from "../constants/SPELL.js";

export interface IItemBlueprintData {
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
  },
  spellCharges?: {
    name: string;
    level: number;
    maxCharges: number;
  },
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
}

// Return item blueprint, or a message explaining failure (if by author, emit message to their socket)
async function createItemBlueprint(
  itemFormData: any,
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
        fixture: false,
        food: false,
        guild: false,
        hidden: false,
        lamp: false,
        light: true,
        mage: true,
        neutral: true,
        quest: false,
        temporary: false,
        rogue: true,
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
        isFinesse: false,
        isLight: false,
        isReach: false,
        isRanged: false,
        isTwohand: false,
      };
    }

    originZone.itemBlueprints.push(newItemBlueprint);
    await originZone.save();
    await originZone.initRooms();
    // logger.debug(`Saved zone ${originZone.name} with item blueprints for ${originZone.itemBlueprints.map(item => item.name)}`)

    logger.info(
      `Author "${author.name}" created item blueprint "${newItemBlueprint.name}".`
    );
    message.type = "success";
    message.content = `You made an item blueprint: ${newItemBlueprint.name}. Type EDIT ITEM to modify it, or EDIT ROOM to place one here.`;
    worldEmitter.emit(`messageFor${author.username}`, message);
    await look({ commandWord: "look" }, author);
    return newItemBlueprint;
  } catch (error: any) {
    logger.error(`Error in createItemBlueprint: ${error.message} `);
    throw error;
  }
}

export default createItemBlueprint;
