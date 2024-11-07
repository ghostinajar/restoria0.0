// editUser
// allows user to edit user description
import logger from "../logger.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import truncateDescription from "../util/truncateDescription.js";
async function editUser(user, userDescription) {
    try {
        if (!userDescription) {
            worldEmitter.emit(`messageFor${user.username}`, makeMessage(`rejected`, `Oops! The form didn't seem to have any new descriptions.`));
            return;
        }
        truncateDescription(userDescription, user);
        if (userDescription !== user.description) {
            user.description = userDescription;
        }
        user.history.modifiedDate = new Date();
        await user.save();
        worldEmitter.emit(`messageFor${user.username}`, makeMessage(`success`, `User description saved! Type 'examine ${user.name}' to view it.`));
        return;
    }
    catch (error) {
        worldEmitter.emit(`messageFor${user.username}`, makeMessage("rejection", `There was an error on our server. Ralu will have a look at it soon!`));
        if (error instanceof Error) {
            logger.error(`editUser error for user ${user.username}: ${error.message}`);
        }
        else {
            logger.error(`editUser error for user ${user.username}: ${error}`);
        }
    }
}
export default editUser;
