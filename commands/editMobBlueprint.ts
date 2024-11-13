// editMobBlueprint
// processes and saves data from edit_mob_blueprint user form submission
import mongoose from "mongoose";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import truncateDescription from "../util/truncateDescription.js";
import { IStatBlock } from "../model/classes/StatBlock.js";
import { IItemNode } from "../model/classes/ItemNode.js";
import { IAffix } from "../model/classes/Affix.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";

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
  try {
    if (!mobId) throw new Error("Missing mobId");
    if (!formData) throw new Error("Missing formData");
    if (!user) throw new Error("Missing user");

    //get existing mob data
    const zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error(
        `couldn't find zone to save for user ${user.username}'s location.}`
      );
    }
    const mob = zone.mobBlueprints.find(
      (blueprint) => blueprint._id.toString() === mobId.toString()
    );
    if (!mob) {
      throw new Error(
        `editMobBlueprint couldn't find mob with id ${mobId} in ${zone.name}`
      );
    }

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
      });
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
  } catch (error: unknown) {
    catchErrorHandlerForFunction("editMobBlueprint", error, user.name)
  }
}

export default editMobBlueprint;
