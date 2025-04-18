// equip
// user can EQUIP an item to an appropriate slot
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
async function equip(parsedCommand, user) {
    try {
        // Fail if user doesn't have the item in their inventory
        // Fail if (!item.type === ITEM.TYPE.WEAPON && !item.type === ITEM.TYPE.ARMOR)
        // Fail if user and item aren't compatible (e.g. cleric, mage, rogue, warrior, moon, neutral, sun)
        // Fail if indirect object is provided in parsedCommand but isn't a valid wearable location
        // If the slot is already occupied, unequip the item and return it to the inventory
        // Equip the item to the appropriate slot and remove it from inventory
    }
    catch (error) {
        catchErrorHandlerForFunction(`equip`, error, user?.name);
    }
}
export default equip;
