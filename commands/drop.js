// drop
// user command to drop an item from their inventory to the room inventory (the ground)
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageMissingTargetToUser from "../util/messageMissingTargetToUser.js";
import messageToUsername from "../util/messageToUsername.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import makeMessage from "../util/makeMessage.js";
import relocateItem from "../util/relocateItem.js";
import findObjectInInventory from "../util/findObjectInInventory.js";
async function drop(parsedCommand, user) {
    try {
        if (!parsedCommand.directObject) {
            messageToUsername(user.username, "Drop what? (e.g. you can DROP APPLE if it's in your INVENTORY)", "help", true);
            return;
        }
        const targetKeyword = parsedCommand.directObject;
        const room = await getRoomOfUser(user);
        if (!room) {
            throw new Error(`Room not found for user ${user.name}`);
        }
        if (parsedCommand.targetsAll) {
            // handle "all"
            let itemsToDrop = user.inventory.filter((item) => item.keywords.some((keyword) => keyword.startsWith(targetKeyword)));
            if (!itemsToDrop) {
                messageMissingTargetToUser(user, targetKeyword);
                return;
            }
            itemsToDrop.forEach((itemToDrop) => {
                relocateItem(itemToDrop, user.inventory, room.inventory);
                messageToUsername(user.username, `You dropped ${itemToDrop.name} on the ground.`, `success`);
            });
            worldEmitter.emit(`messageFor${user.username}sRoom`, makeMessage(`itemIsHere`, `${user.name} dropped some items on the ground.`));
        }
        else {
            // handle single object
            let itemToDrop = await findObjectInInventory(user.inventory, targetKeyword, parsedCommand.directObjectOrdinal);
            if (!itemToDrop) {
                messageMissingTargetToUser(user, targetKeyword);
                return;
            }
            relocateItem(itemToDrop, user.inventory, user.inventory);
            messageToUsername(user.username, `You dropped ${itemToDrop.name} on the ground.`, `success`);
            worldEmitter.emit(`messageFor${user.username}sRoom`, makeMessage(`itemIsHere`, `${user.name} dropped ${itemToDrop.name} on the ground.`));
        }
        await user.save();
    }
    catch (error) {
        catchErrorHandlerForFunction(`drop`, error, user?.name);
    }
}
export default drop;
