// get
// user can get objects from the ground or from containers
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";
async function get(parsedCommand, user) {
    try {
        console.log(`get command executed by ${user?.name}`);
        console.log(`parsedCommand:`, parsedCommand);
        let containerKeyword = parsedCommand.indirectObject || `noIndirectObject`;
        let targetContainer;
        // identify container in user's inventory else in room inventory
        targetContainer = user.inventory.find((item) => item.keywords.includes(containerKeyword));
        // fail and notify user if container is a mob (ca
        // fail and notify user if container isn't present
        if (!targetContainer) {
            messageToUsername(user.name, `You can't seem to find ${parsedCommand.indirectObject} here.`);
            return;
        }
        // fail and notify user if target isn't present in container or room
        // identify target object in container
        // add target to player inventory
        // remove target from room or container
    }
    catch (error) {
        catchErrorHandlerForFunction(`get`, error, user?.name);
    }
}
export default get;
