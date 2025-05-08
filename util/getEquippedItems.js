// getEquippedItems
// returns an array with all the items equipped on a user or mob
import { WEARABLE_LOCATION_VALUES } from "../constants/WEARABLE_LOCATION.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
function getEquippedItems(agent) {
    try {
        let eqAndWeapons = [...WEARABLE_LOCATION_VALUES, "weapon1", "weapon2"];
        let equipmentArray = [];
        eqAndWeapons.forEach((location) => {
            let itemInSlot = agent.equipped[location];
            if (itemInSlot) {
                equipmentArray.push(itemInSlot);
            }
        });
        return equipmentArray;
    }
    catch (error) {
        catchErrorHandlerForFunction(`getEquippedItems`, error);
        return [];
    }
}
export default getEquippedItems;
