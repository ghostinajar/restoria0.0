// findObjectInInventory
// utility function to find IItem object by keyword from any inventory (an array of IItem ojects), returns the object or undefined
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
async function findObjectInInventory(inventory, objectKeyword, objectOrdinal) {
    try {
        // find eligible matches
        const filteredInventory = inventory.filter((item) => item.keywords.some((keyword) => keyword.includes(objectKeyword)));
        let foundObject;
        if (objectOrdinal !== undefined && objectOrdinal !== "all") {
            // Check if the requested ordinal exists in the filtered inventory
            foundObject = objectOrdinal < filteredInventory.length
                ? filteredInventory[objectOrdinal]
                : undefined;
        }
        else {
            // If no ordinal specified or "all" requested, return first match if any
            foundObject = filteredInventory[0];
        }
        return foundObject;
    }
    catch (error) {
        catchErrorHandlerForFunction(`findObjectInInventory.ts:`, error);
    }
}
export default findObjectInInventory;
