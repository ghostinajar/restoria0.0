// wield
// // user can WEILD a weapon-type item
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";
async function wield(item, user) {
    try {
        messageToUsername(user.username, `WIELD is still in development.`);
    }
    catch (error) {
        catchErrorHandlerForFunction(`wield`, error, user?.name);
    }
}
export default wield;
