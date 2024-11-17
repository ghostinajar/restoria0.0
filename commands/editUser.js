import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
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
        catchErrorHandlerForFunction("editUser", error, user.name);
    }
}
export default editUser;
