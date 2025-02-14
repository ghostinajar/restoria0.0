// findObjectInInventory
// utility function to find IItem object by keyword from any inventory (an array of IItem ojects), returns the object or undefined
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
async function findObjectInInventory(inventory, objectKeyword, objectOrdinal) {
    try {
        // find eligible matches
        const filteredInventory = inventory.filter((item) => item.keywords.some((keyword) => keyword.includes(objectKeyword)));
        let foundObject;
        if (objectOrdinal !== undefined &&
            objectOrdinal !== "all" &&
            objectOrdinal < filteredInventory.length) {
            foundObject = filteredInventory[objectOrdinal];
        }
        else {
            foundObject = filteredInventory[0];
        }
        return foundObject;
    }
    catch (error) {
        catchErrorHandlerForFunction(`findObjectInInventory.ts:`, error);
    }
}
export default findObjectInInventory;
