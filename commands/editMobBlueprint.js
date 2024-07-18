import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import truncateDescription from "../util/truncateDescription.js";
async function editMobBlueprint(mobId, formData, user) {
    // logger.debug(`editMobBlueprint submitted by user ${user.name} for mob id: ${mobId.toString()}`);
    if (!mobId || !formData || !user) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejected`, `Oops! Can't seem to edit this mob.`));
        return;
    }
    //get existing mob data
    const zone = await getZoneOfUser(user);
    if (!zone) {
        logger.error(`editMobBlueprint couldn't find zone to save for user ${user.username}'s location.}`);
        return;
    }
    // logger.debug(`editMobBlueprint finding ${mobId} in ${zone.mobBlueprints.map(blueprint => blueprint._id)}`);
    const mob = zone.mobBlueprints.find((blueprint) => blueprint._id.toString() === mobId.toString());
    if (!mob) {
        logger.error(`editMobBlueprint couldn't find mob with id ${mobId} in ${zone.name}`);
        return;
    }
    // logger.debug(`editMobBlueprint found a match! ${mob.name}`)
    //coerce formData property values to correct types
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
    mob.pronouns = formData.pronouns;
    mob.level = formData.level;
    mob.job = formData.job;
    mob.statBlock = formData.statBlock;
    mob.keywords = formData.keywords;
    mob.isUnique = formData.isUnique;
    mob.isMount = formData.isMount;
    mob.isAggressive = formData.isAggressive;
    mob.description = formData.description;
    mob.history.modifiedDate = new Date();
    await zone.save();
    await zone.initRooms();
    worldEmitter.emit(`messageFor${user.username}`, makeMessage(`success`, `Mob updated!`));
}
export default editMobBlueprint;
