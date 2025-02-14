import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import findObjectInInventory from "../util/findObjectInInventory.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import messageToUsername from "../util/messageToUsername.js";
import relocateItem from "../util/relocateItem.js";
async function get(parsedCommand, user) {
    try {
        console.log(`get command executed by ${user?.name}`);
        console.log(`parsedCommand:`, parsedCommand);
        // if no directObject specified, fail and notify user they need to specify what to get
        if (!parsedCommand.directObject) {
            console.log("messaging user");
            messageToUsername(user.username, `What do you want to get?`, `help`);
            return;
        }
        // find the inventory to get from (find container if specified, else use room.inventory)
        let originInventory;
        if (parsedCommand.indirectObject) {
            // container specified, checking user inventory
            console.log(`container specified, (${parsedCommand.indirectObject}) checking user inventory...`);
            let specifiedContainer = await findObjectInInventory(user.inventory, parsedCommand.indirectObject, parsedCommand.indirectObjectOrdinal);
            if (specifiedContainer) {
                // container found in user inventory!
                console.log(`container found in user inventory! ${specifiedContainer.name}`);
                originInventory = specifiedContainer.inventory;
            }
            else {
                // container not found in user inventory, checking room inventory
                console.log(`container not found in user inventory, checking room inventory...`);
                let room = await getRoomOfUser(user);
                if (!room) {
                    throw new Error(`Room not found for user ${user.name}.`);
                }
                specifiedContainer = await findObjectInInventory(room.inventory, parsedCommand.indirectObject, parsedCommand.indirectObjectOrdinal);
                if (specifiedContainer) {
                    // container found in room inventory!
                    console.log(`container found in room inventory! ${specifiedContainer.name}`);
                    originInventory = specifiedContainer.inventory;
                }
                else {
                    // check room.mobs for a keyword match (can't GET from mobs, they could try STEAL)
                    if (room.mobs.length > 0) {
                        let eligibleMobs = room.mobs.filter((mob) => mob.keywords.some((keyword) => parsedCommand.indirectObject &&
                            keyword.includes(parsedCommand.indirectObject)));
                        if (eligibleMobs.length > 0) {
                            messageToUsername(user.username, `You can't GET items from mobs. Maybe a rogue could STEAL it...`, `help`, true);
                            return;
                        }
                    }
                    else {
                        // specified container not found anywhere, notify user
                        messageToUsername(user.username, `You can't find the ${parsedCommand.indirectObject} to get from.`, `rejection`);
                        return;
                    }
                }
            }
        }
        else {
            // no container specified, using room.inventory
            console.log(`no container specified, using room.inventory...`);
            let room = await getRoomOfUser(user);
            if (!room) {
                throw new Error(`Room not found for user ${user.name}.`);
            }
            originInventory = room.inventory;
        }
        if (originInventory === undefined) {
            throw new Error(`originInventory not found.`);
        }
        let unfoundMessage = `You can't seem to find the ${parsedCommand.directObject}.`;
        if (parsedCommand.targetsAll) {
            // move all matching items from originInventory to user.inventory
            console.log(`move matching items from originInventory to user.inventory`);
            let targetItems = originInventory.filter((item) => item.keywords.some((keyword) => parsedCommand.directObject &&
                keyword.includes(parsedCommand.directObject)));
            if (targetItems.length === 0) {
                messageToUsername(user.username, unfoundMessage, `rejection`);
                return;
            }
            targetItems.forEach(async (item) => {
                await relocateItem(item, user.inventory, originInventory);
                messageToUsername(user.username, `You got ${item.name}.`, "success");
            });
        }
        else {
            // finding single matching item from originInventory
            console.log(`finding single matching item from originInventory`);
            let targetObject = await findObjectInInventory(originInventory, parsedCommand.directObject, parsedCommand.directObjectOrdinal);
            if (!targetObject) {
                messageToUsername(user.username, unfoundMessage, `rejection`);
                return;
            }
            // move single matching item from originInventory to user.inventory
            console.log(`moving single matching item ${targetObject.name} from originInventory to user.inventory`);
            await relocateItem(targetObject, user.inventory, originInventory);
            messageToUsername(user.username, `You got ${targetObject.name}.`, "success");
        }
        console.log(`get successful! saving user...`);
        console.log(user.inventory.map((item) => item.name));
        // await user.save();
    }
    catch (error) {
        catchErrorHandlerForFunction(`get`, error, user?.name);
    }
}
export default get;
