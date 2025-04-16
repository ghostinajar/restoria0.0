// give
// user can give an item to a user or mob
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import findObjectInInventory from "../util/findObjectInInventory.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import messageToUsername from "../util/messageToUsername.js";
import relocateItem from "../util/relocateItem.js";
import selectTargetByOrdinal from "../util/selectTargetByOrdinal.js";
async function give(parsedCommand, user) {
    try {
        const itemKeyword = parsedCommand.directObject;
        // fail if no item keyword
        if (!itemKeyword) {
            messageToUsername(user.username, `Give what? e.g. GIVE APPLE RALU`, `help`, true);
            return;
        }
        // fail if no recipient keyword
        const recipientKeyword = parsedCommand.indirectObject;
        if (!recipientKeyword) {
            messageToUsername(user.username, `Give to whom? e.g. GIVE APPLE RALU`, `help`, true);
            return;
        }
        const item = await findObjectInInventory(user.inventory, itemKeyword);
        // fail if no item found
        if (!item) {
            messageToUsername(user.username, `You don't have the ${itemKeyword} in your inventory.`, `help`, false);
            return;
        }
        const room = await getRoomOfUser(user);
        if (!room) {
            throw new Error(`Room not found for user ${user.username}`);
        }
        let recipient;
        recipient = room.users.find((user) => user.username.startsWith(recipientKeyword.toLowerCase()));
        if (!recipient) {
            recipient = selectTargetByOrdinal(parsedCommand.directObjectOrdinal || 0, recipientKeyword, room.mobs);
        }
        // fail if no recipient found
        if (!recipient || !recipient.inventory) {
            messageToUsername(user.username, `There's no one called ${recipientKeyword} here.`, `rejection`, false);
            return;
        }
        // fail if recipient has no inventory room
        if (recipient.inventory.length >= recipient.capacity) {
            messageToUsername(user.username, `${recipient.name} can't carry any more items.`, `rejection`, false);
            return;
        }
        // relocate the item, save and notify users
        await relocateItem(item, user.inventory, recipient.inventory);
        await user.save();
        messageToUsername(user.username, `You gave ${item.name} to ${recipient.name}.`, `success`, false);
        if ("save" in recipient) {
            await recipient.save();
            messageToUsername(recipient.username, `${user.name} gave you ${item.name}.`, `success`, false);
        }
    }
    catch (error) {
        catchErrorHandlerForFunction(`give`, error, user?.name);
    }
}
export default give;
