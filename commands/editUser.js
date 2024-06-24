import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
async function editUser(user, userDescription) {
    let changed = false;
    logger.debug(`editUser updating user ${user.name} with description: ${JSON.stringify(userDescription)}`);
    if (!userDescription) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejected`, `Oops! The form didn't seem to have any new descriptions.`));
        return;
    }
    if (userDescription.look !== user.description.look) {
        user.description.look = userDescription.look;
        changed = true;
        logger.debug(`editUser updated user ${user.name}'s look description: ${user.description.look}`);
    }
    if (userDescription.examine !== user.description.examine) {
        user.description.examine = userDescription.examine;
        changed = true;
        logger.debug(`editUser updated user ${user.name}'s examine description: ${user.description.examine}`);
    }
    if (userDescription.study !== user.description.study) {
        user.description.study = userDescription.study;
        changed = true;
        logger.debug(`editUser updated user ${user.name}'s study description: ${user.description.study}`);
    }
    if (userDescription.research !== user.description.research) {
        user.description.research = userDescription.research;
        changed = true;
        logger.debug(`editUser updated user ${user.name}'s look description: ${user.description.research}`);
    }
    if (changed) {
        await user.save();
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`saved`, `Character description saved! Type 'look ${user.name}' to view it.`));
        return;
    }
    else {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejected`, `No change saved to character description.`));
        return;
    }
}
export default editUser;
