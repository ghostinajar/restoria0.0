// inventory
// shows a user the items in their inventory
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import makeMessage from "../util/makeMessage.js";
import messageToUsername from "../util/messageToUsername.js";
async function inventory(user) {
    try {
        if (user.inventory.length === 0) {
            messageToUsername(user.username, `You're not carrying anything.`, `rejection`, true);
            return;
        }
        // start counting the number of each item in the inventory
        const itemCounts = {};
        // Loop through the inventory and count items by their blueprint ID
        for (const item of user.inventory) {
            const blueprintKey = item.itemBlueprint.toString(); // Use the blueprint ID as the key
            if (!itemCounts[blueprintKey]) {
                itemCounts[blueprintKey] = { name: item.name, count: 0 };
            }
            itemCounts[blueprintKey].count++;
        }
        // generate strings for the inventory items
        const inventoryStrings = Object.values(itemCounts).map((item) => item.count > 1 ? `${item.name} (${item.count})` : item.name);
        // create and send the message array
        const inventoryMessageArray = [];
        const inventoryTitle = `Your Inventory:`;
        inventoryMessageArray.push(makeMessage(`help`, inventoryTitle));
        inventoryStrings.forEach((itemString) => {
            inventoryMessageArray.push(makeMessage(`itemIsHere`, `  ${itemString}`));
        });
        inventoryMessageArray.push(makeMessage(`help`, `You're holding ${user.inventory.length}/${user.capacity} items.`));
        worldEmitter.emit(`messageArrayFor${user.username}`, inventoryMessageArray);
    }
    catch (error) {
        catchErrorHandlerForFunction(`inventory`, error, user?.name);
    }
}
export default inventory;
