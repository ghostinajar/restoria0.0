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
    if (userDescription.examine !== user.description.examine) {
        if (userDescription.examine && userDescription.examine.length > 240) {
            userDescription.examine = userDescription.examine.substring(0, 240);
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Examine descriptions should be 240 characters (3 lines) or less. Shortened to '${userDescription.examine}'.`));
        }
        user.description.examine = userDescription.examine;
        changed = true;
        logger.debug(`editUser updated user ${user.name}'s examine description: ${user.description.examine}`);
    }
    if (userDescription.study !== user.description.study) {
        if (userDescription.study && userDescription.study.length > 640) {
            userDescription.study = userDescription.study.substring(0, 640);
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Study descriptions should be 640 characters (8 lines) or less. Shortened to '${userDescription.study}'.`));
        }
        user.description.study = userDescription.study;
        changed = true;
        logger.debug(`editUser updated user ${user.name}'s study description: ${user.description.study}`);
    }
    if (userDescription.research !== user.description.research) {
        if (userDescription.research && userDescription.research.length > 1600) {
            userDescription.research = userDescription.research.substring(0, 1600);
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejection`, `Research descriptions should be 1600 characters (20 lines) or less. Shortened to '${userDescription.research}'.`));
        }
        user.description.research = userDescription.research;
        changed = true;
        logger.debug(`editUser updated user ${user.name}'s research description: ${user.description.research}`);
    }
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
