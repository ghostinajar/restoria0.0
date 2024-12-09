// editMobBlueprint
// processes and saves data from edit_mob_blueprint user form submission
import mongoose from "mongoose";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import truncateDescription from "../util/truncateDescription.js";
import { IItemNode } from "../model/classes/ItemNode.js";
import { IAffix } from "../model/classes/Affix.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import putNumberInRange from "../util/putNumberInRange.js";

export interface IEditMobFormData {
  _id: mongoose.Types.ObjectId;
  name: string;
  keywords: string[];
  pronouns: number;
  level: number;
  job: string;
  spirit: number;
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

async function editMobBlueprint(formData: IEditMobFormData, user: IUser) {
  try {
    //get existing mob data
    const zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error(
        `couldn't find zone to save for user ${user.username}'s location.}`
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

    const mob = zone.mobBlueprints.find(
      (blueprint) => blueprint._id.toString() === formData._id.toString()
    );
    if (!mob) {
      throw new Error(
        `editMobBlueprint couldn't find mob with id ${formData._id} in ${zone.name}`
      );
    }

    truncateDescription(formData.description, user);

    //update values and save zone
    mob.name = formData.name;
    mob.keywords = formData.keywords;
    mob.pronouns = formData.pronouns;
    mob.level = putNumberInRange(1, 31, formData.level, user);
    mob.job = formData.job;
    mob.statBlock = {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
      spirit: putNumberInRange(-1000, 1000, formData.spirit, user),
    };
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
    catchErrorHandlerForFunction("editMobBlueprint", error, user.name);
  }
}

export default editMobBlueprint;
