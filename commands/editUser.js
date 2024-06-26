import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../types/makeMessage.js";
import truncateDescription from "../util/truncateDescription.js";
async function editUser(user, userDescription) {
    let changed = false;
    logger.debug(`editUser updating user ${user.name} with description: ${JSON.stringify(userDescription)}`);
    if (!userDescription) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejected`, `Oops! The form didn't seem to have any new descriptions.`));
        return;
    }
    truncateDescription(userDescription, user);
    //replace with refactored logic to truncateDescription, then compare, then set description to user
    if (userDescription !== user.description) {
        user.description = userDescription;
        changed = true;
    }
    logger.debug(`editUser updated user ${user.name}'s description: ${JSON.stringify(user.description)}`);
    if (changed) {
        await user.save();
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`success`, `User description saved! Type 'look ${user.name}' to view it.`));
        return;
    }
    else {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejected`, `No change saved to user description.`));
        return;
    }
}
export default editUser;
