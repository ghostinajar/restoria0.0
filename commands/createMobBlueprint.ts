// createMobBlueprint
// saves incoming data from create_mob_blueprint_form user submission
import makeMessage from "../util/makeMessage.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import logger from "../logger.js";
import mongoose from "mongoose";
import { IUser } from "../model/classes/User.js";
import { IDescription } from "../model/classes/Description.js";
import truncateDescription from "../util/truncateDescription.js";
import { IMobBlueprint } from "../model/classes/MobBlueprint.js";
import look from "./look.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import { historyStartingNow } from "../model/classes/History.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import putNumberInRange from "../util/putNumberInRange.js";

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

async function createMobBlueprint(
  mobFormData: ICreateMobFormData,
  user: IUser
) {
  try {
    // logger.debug(`Trying to create mob blueprint ${mobFormData.name}.`);

    let zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error(`Couldn't find zone to create mob.`)
    }

    const mobDescription: IDescription = {
      look: mobFormData.description.look,
      examine: mobFormData.description.examine,
    };
    truncateDescription(mobDescription, user);

    let newMobBlueprint: IMobBlueprint = {
      _id: new mongoose.Types.ObjectId(),
      author: user._id,
      name: mobFormData.name,
      pronouns: mobFormData.pronouns,
      history: historyStartingNow(),
      level: putNumberInRange(1, 31, mobFormData.level, user),
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

    zone.mobBlueprints.push(newMobBlueprint);
    await zone.save();
    await zone.initRooms();
    // logger.debug(`Saved zone ${originZone.name} with mob blueprints for ${originZone.mobBlueprints.map(mob => mob.name)}`)

    logger.info(
      `Author "${user.name}" created mob blueprint "${newMobBlueprint.name}".`
    );
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(
        "success",
        `You created a mob blueprint for ${newMobBlueprint.name}. To place one here, type EDIT ROOM`
      )
    );
    await look({ commandWord: "look" }, user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction("createMobBlueprint", error, user.name)
  }
}

export default createMobBlueprint;
