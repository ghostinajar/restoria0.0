// editMobBlueprint
// processes and saves data from edit_mob_blueprint user form submission
import mongoose from "mongoose";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import truncateDescription from "../util/truncateDescription.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
async function editMobBlueprint(formData, user) {
    try {
        if (!formData._id)
            throw new Error("Missing mobId");
        if (!formData)
            throw new Error("Missing formData");
        if (!user)
            throw new Error("Missing user");
        //get existing mob data
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`couldn't find zone to save for user ${user.username}'s location.}`);
        }
        const mob = zone.mobBlueprints.find((blueprint) => blueprint._id.toString() === formData._id.toString());
        if (!mob) {
            throw new Error(`editMobBlueprint couldn't find mob with id ${formData._id} in ${zone.name}`);
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
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`success`, `Mob updated!`));
    }
    catch (error) {
        catchErrorHandlerForFunction("editMobBlueprint", error, user.name);
    }
}
export default editMobBlueprint;
