// unequip
// remove an item from the user's equipped items
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";
async function unequip(parsedCommand, user, item, location) {
    try {
        // handle a direct call with item and ?location specified
        if (item && location) {
            console.log(`unequiping ${user.name}'s ${item?.name} from ${location}`);
            user.inventory.push(item);
            user.equipped[location] = null;
            messageToUsername(user.username, `You unequipped ${item.name}.`, `itemIsHere`);
            console.log(`${user.name}'s ${location} now holds ${user.equipped[location]}`);
        }
        // handle a call with parsedCommand from the user
    }
    catch (error) {
        catchErrorHandlerForFunction(`unequip`, error, user?.name);
    }
}
export default unequip;
