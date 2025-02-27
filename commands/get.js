import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import findObjectInInventory from "../util/findObjectInInventory.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import messageToUsername from "../util/messageToUsername.js";
import relocateItem from "../util/relocateItem.js";
function failToFindItem(username, itemName) {
    messageToUsername(username, `You can't seem to find the ${itemName}.`, `help`);
}
async function get(parsedCommand, user) {
    try {
        // fail if item not specified
        let specifiedItemKeyword = parsedCommand.directObject;
        if (!specifiedItemKeyword) {
            console.log("messaging user");
            messageToUsername(user.username, `What do you want to get?`, `help`);
            return;
        }
        let specifiedContainerKeyword = parsedCommand.indirectObject || "the ground";
        let room = await getRoomOfUser(user);
        if (!room) {
            throw new Error(`Room not found for user ${user.name}.`);
        }
        // handle direct get (from room inventory)
        if (specifiedContainerKeyword === "the ground") {
            let itemToGet = await findObjectInInventory(room.inventory, specifiedItemKeyword, parsedCommand.directObjectOrdinal);
            if (!itemToGet) {
                failToFindItem(user.username, specifiedItemKeyword);
                return;
            }
            // handle "all"
            if (parsedCommand.targetsAll) {
                let itemsToGet = room.inventory.filter((item) => item.keywords.some((keyword) => keyword.includes(specifiedItemKeyword)));
                if (!itemsToGet) {
                    failToFindItem(user.username, specifiedItemKeyword);
                    return;
                }
                itemsToGet.forEach((itemToGet) => {
                    if (itemToGet.tags.fixture) {
                        messageToUsername(user.username, `You can't get ${itemToGet.name}, because it's fixed in place.`, `help`);
                        return;
                    }
                    relocateItem(itemToGet, room.inventory, user.inventory);
                    messageToUsername(user.username, `You got ${itemToGet.name} from the ground.`, `success`);
                });
            }
            else {
                //handle single object (directObjectOrdinal is an integer or unspecifed
                // fail if item is a fixture
                if (itemToGet.tags.fixture) {
                    messageToUsername(user.username, `You can't get ${itemToGet.name}, because it's fixed in place.`, `help`);
                    return;
                }
                relocateItem(itemToGet, room.inventory, user.inventory);
                messageToUsername(user.username, `You got ${itemToGet.name} from the ground.`, `success`);
            }
            console.log(user.inventory.map((item) => item.name));
            // await user.save();
            return;
        }
        // handle get from container
        const userInventoryHasEligibleContainers = user.inventory.some((container) => container.keywords.some((keyword) => keyword.toLowerCase() === specifiedContainerKeyword));
        const roomInventoryHasEligibleContainers = room.inventory.some((container) => container.keywords.some((keyword) => keyword.toLowerCase() === specifiedContainerKeyword));
        const mobsHaveSpecifiedContainerKeywordAsKeyword = room.mobs.some((mob) => mob.keywords.includes(specifiedContainerKeyword));
        const usersHaveSpecifiedContainerKeywordAsUsername = room.users.some((user) => user.username === specifiedContainerKeyword);
        // fail if container only found in room.mobs
        if (!userInventoryHasEligibleContainers &&
            !roomInventoryHasEligibleContainers &&
            mobsHaveSpecifiedContainerKeywordAsKeyword) {
            messageToUsername(user.username, `You can't GET from a mob. A rogue could try to STEAL it...`, `help`);
            return;
        }
        // fail if container only found in room.users
        if (!userInventoryHasEligibleContainers &&
            !roomInventoryHasEligibleContainers &&
            usersHaveSpecifiedContainerKeywordAsUsername) {
            messageToUsername(user.username, `You can't GET a player's items. You could ask them to GIVE it...`, `help`);
            return;
        }
        // fail if container not found anywhere
        function failToFindContainer(username, itemName) {
            messageToUsername(username, `You can't seem to find the ${specifiedContainerKeyword} to get it from.`, `help`);
        }
        if (!userInventoryHasEligibleContainers &&
            !roomInventoryHasEligibleContainers &&
            !usersHaveSpecifiedContainerKeywordAsUsername &&
            !mobsHaveSpecifiedContainerKeywordAsKeyword) {
            failToFindContainer(user.username, specifiedContainerKeyword);
            return;
        }
        // fail if container specified but not found by ordinal
        let originInventory;
        let originContainer;
        if (userInventoryHasEligibleContainers) {
            originContainer = await findObjectInInventory(user.inventory, specifiedContainerKeyword, parsedCommand.indirectObjectOrdinal);
            if (originContainer) {
                originInventory = originContainer.inventory;
            }
        }
        if (!originInventory && roomInventoryHasEligibleContainers) {
            originContainer = await findObjectInInventory(room.inventory, specifiedContainerKeyword, parsedCommand.indirectObjectOrdinal);
            if (originContainer) {
                originInventory = originContainer.inventory;
            }
        }
        if (!originInventory) {
            failToFindContainer(user.username, specifiedContainerKeyword);
            return;
        }
        if (!originContainer) {
            return;
        }
        // fail if item not found in container
        let itemToGet = await findObjectInInventory(originInventory, specifiedItemKeyword, parsedCommand.directObjectOrdinal);
        if (!itemToGet) {
            failToFindItem(user.username, specifiedItemKeyword);
            return;
        }
        // success!
        // move item from container to user inventory
        if (parsedCommand.targetsAll) {
            // handle get all
            let itemsToGet = originInventory.filter((item) => item.keywords.some((keyword) => keyword.includes(specifiedItemKeyword)));
            if (!itemsToGet) {
                failToFindItem(user.username, specifiedItemKeyword);
                return;
            }
            itemsToGet.forEach((itemToGet) => {
                if (itemToGet.tags.fixture) {
                    messageToUsername(user.username, `You can't get ${itemToGet.name}, because it's fixed in place.`, `help`);
                    return;
                }
                relocateItem(itemToGet, originInventory, user.inventory);
                messageToUsername(user.username, `You got ${itemToGet.name} from ${originContainer.name}.`, `success`);
            });
        }
        else {
            // handle get single object
            relocateItem(itemToGet, originInventory, user.inventory);
            messageToUsername(user.username, `You got ${itemToGet.name} from ${specifiedContainerKeyword}.`, `success`);
        }
        console.log(user.inventory.map((item) => item.name));
        // await user.save();
    }
    catch (error) {
        catchErrorHandlerForFunction(`get`, error, user?.name);
    }
}
export default get;
