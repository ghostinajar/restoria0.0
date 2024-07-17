import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import truncateDescription from "../util/truncateDescription.js";
async function editMobBlueprint(mobId, mobBlueprintData, user) {
    logger.debug(`editMobBlueprint submitted by user ${user.name} for mob id: ${mobId.toString()}`);
    if (!mobId || !mobBlueprintData || !user) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejected`, `Oops! Can't seem to edit this mob.`));
        return;
    }
    truncateDescription(mobBlueprintData.description, user);
    //get existing mob data
    const zone = await getZoneOfUser(user);
    if (!zone) {
        logger.error(`editMobBlueprint couldn't find zone to save for user ${user.username}'s location.}`);
        return;
    }
    ;
    logger.debug(`editMobBlueprint finding ${mobId} in ${zone.mobBlueprints.map(blueprint => blueprint._id)}`);
    const mob = zone.mobBlueprints.find(blueprint => blueprint._id.toString() === mobId.toString());
    if (!mob) {
        logger.error(`editMobBlueprint couldn't find mob with id ${mobId} in ${zone.name}`);
        return;
    }
    logger.debug(`editMobBlueprint found a match! ${mob.name}`);
    //compare, update, flag changed
    function updateMob(newData, existingData) {
        for (let key in mobBlueprintData) {
            if (mobBlueprintData.hasOwnProperty(key)) {
                if (existingData[key] !== newData[key]) {
                    existingData[key] = newData[key];
                    changed = true;
                }
            }
        }
    }
    let changed = false;
    updateMob(mobBlueprintData, mob);
    logger.debug(`editMobBlueprint has changed: ${changed}`);
    if (changed) {
        mob.history.modifiedDate = new Date();
        await zone.save();
        await zone.initRooms();
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`success`, `Mob updated!`));
        logger.debug(`editMob updated mob ${mob.name}:
      pronouns ${mob.pronouns}, 
      level ${mob.level},
      job ${mob.job},
      statBlock ${mob.statBlock},
      keywords ${mob.keywords},
      isUnique ${mob.isUnique},
      isMount ${mob.isMount},
      isAggressive ${mob.isAggressive},
      ${JSON.stringify(mob.description)}`);
        return;
    }
    else {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejected`, `No change saved to mob.`));
        return;
    }
}
export default editMobBlueprint;
