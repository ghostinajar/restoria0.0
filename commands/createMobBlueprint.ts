// createMobBlueprint
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
import { IMobBlueprint } from "../model/classes/MobBlueprint.js";
import look from "./look.js";

export interface ICreateMobFormData {
  name: string;
  keywords: string[];
  pronouns: number;
  level: number;
  job: string;
  description: {
    look: string;
    examine: string;
  };
}

// Return mob blueprint, or a message explaining failure (if by author, emit message to their socket)
async function createMobBlueprint(
  mobFormData: ICreateMobFormData,
  author: IUser
): Promise<IMobBlueprint | IMessage> {
  try {
    let message = makeMessage("rejection", ``);

    // logger.debug(`Trying to create mob blueprint ${mobFormData.name}.`);
    // let originRoom : IRoom = await getRoomOfUser(author);
    // if (!originRoom) {
    //   logger.error(`Couldn't find origin room to create mob.`);
    // }
    let originZone: IZone = await new Promise((resolve) => {
      worldEmitter.once(
        `zone${author.location.inZone.toString()}Loaded`,
        resolve
      );
      worldEmitter.emit(`zoneRequested`, author.location.inZone.toString());
    });
    if (!originZone) {
      logger.error(`Couldn't find origin zone to create mob.`);
    }

    const mobDescription: IDescription = {
      look: mobFormData.description.look,
      examine: mobFormData.description.examine,
    };
    truncateDescription(mobDescription, author);

    let newMobBlueprint: IMobBlueprint = {
      _id: new mongoose.Types.ObjectId(),
      author: author._id,
      name: mobFormData.name,
      pronouns: mobFormData.pronouns,
      history: {
        creationDate: new Date(),
        modifiedDate: new Date(),
        completionStatus: COMPLETION_STATUS.DRAFT,
      },
      level: mobFormData.level,
      job: mobFormData.job,
      statBlock: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
        spirit: 0,
      },
      goldHeld: 0,
      isUnique: false,
      isMount: false,
      isAggressive: false,
      chattersToPlayer: false,
      emotesToPlayer: false,
      description: mobDescription,
      keywords: mobFormData.keywords,
      affixes: [],
      chatters: [],
      emotes: [],
      itemNodes: [],
    };
    // logger.debug(`createMobBlueprint made newMobBlueprint: ${JSON.stringify(newMobBlueprint)}`);

    originZone.mobBlueprints.push(newMobBlueprint);
    await originZone.save();
    await originZone.initRooms();
    // logger.debug(`Saved zone ${originZone.name} with mob blueprints for ${originZone.mobBlueprints.map(mob => mob.name)}`)

    logger.info(
      `Author "${author.name}" created mob blueprint "${newMobBlueprint.name}".`
    );
    message.type = "success";
    message.content = `You created a mob blueprint for ${newMobBlueprint.name}. To place one here, type EDIT ROOM`;
    worldEmitter.emit(`messageFor${author.username}`, message);
    await look({ commandWord: "look" }, author);
    return newMobBlueprint;
  } catch (error: any) {
    logger.error(`Error in createMobBlueprint: ${error.message} `);
    throw error;
  }
}

export default createMobBlueprint;
