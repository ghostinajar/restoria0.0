// editMobBlueprint
import mongoose from "mongoose";
import logger from "../logger.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import truncateDescription from "../util/truncateDescription.js";
import { IStatBlock } from "../model/classes/StatBlock.js";
import { IItemNode } from "../model/classes/ItemNode.js";
import { IAffix } from "../model/classes/Affix.js";

export interface IEditMobFormData {
  name: string;
  keywords: string[];
  pronouns: number;
  level: number;
  job: string;
  statBlock: IStatBlock;
  isUnique: boolean;
  isMount: boolean;
  isAggressive: boolean;
  description: {
    look: string;
    examine: string;
    study: string;
    research: string;
  };
  itemNodes?: Array<IItemNode>;
  affixes?: Array<IAffix>;
}

async function editMobBlueprint(
  mobId: mongoose.Types.ObjectId,
  formData: IEditMobFormData,
  user: IUser
) {
  // logger.debug(`editMobBlueprint submitted by user ${user.name} for mob id: ${mobId.toString()}`);
  if (!mobId || !formData || !user) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(`rejected`, `Oops! Can't seem to edit this mob.`)
    );
    return;
  }

  //get existing mob data
  const zone = await getZoneOfUser(user);
  if (!zone) {
    logger.error(
      `editMobBlueprint couldn't find zone to save for user ${user.username}'s location.}`
    );
    return;
  }
  // logger.debug(`editMobBlueprint finding ${mobId} in ${zone.mobBlueprints.map(blueprint => blueprint._id)}`);
  const mob = zone.mobBlueprints.find(
    (blueprint) => blueprint._id.toString() === mobId.toString()
  );
  if (!mob) {
    logger.error(
      `editMobBlueprint couldn't find mob with id ${mobId} in ${zone.name}`
    );
    return;
  }
  // logger.debug(`editMobBlueprint found a match! ${mob.name}`)

  //coerce formData property values to correct types
  //TODO is this coercion still necessary now that the form inputs
  //have type="number"
  formData.pronouns = Number(formData.pronouns);
  formData.level = Number(formData.level);
  formData.statBlock.strength = Number(formData.statBlock.strength);
  formData.statBlock.dexterity = Number(formData.statBlock.dexterity);
  formData.statBlock.constitution = Number(formData.statBlock.constitution);
  formData.statBlock.intelligence = Number(formData.statBlock.intelligence);
  formData.statBlock.wisdom = Number(formData.statBlock.wisdom);
  formData.statBlock.spirit = Number(formData.statBlock.spirit);
  truncateDescription(formData.description, user);

  //update values and save zone
  mob.name = formData.name;
  mob.keywords = formData.keywords;
  mob.pronouns = formData.pronouns;
  mob.level = formData.level;
  mob.job = formData.job;
  mob.statBlock = formData.statBlock;
  mob.isUnique = formData.isUnique;
  mob.isMount = formData.isMount;
  mob.isAggressive = formData.isAggressive;
  mob.description = formData.description;
  if (formData.itemNodes) {
    mob.itemNodes = [];
    formData.itemNodes.forEach((node) => {
      mob.itemNodes.push({
        _id: new mongoose.Types.ObjectId(),
        loadsBlueprintId: new mongoose.Types.ObjectId(node.loadsBlueprintId),
        fromZoneId: zone._id,
      });
    })
  }
  if (formData.affixes) {
    mob.affixes = formData.affixes;
  }
  mob.history.modifiedDate = new Date();
  await zone.save();
  await zone.initRooms();

  worldEmitter.emit(
    `messageFor${user.username}`,
    makeMessage(`success`, `Mob updated!`)
  );
}

export default editMobBlueprint;
