// equipment
// shows user equipment items
import { WEARABLE_LOCATION_VALUES } from "../constants/WEARABLE_LOCATION.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import messageToUsername from "../util/messageToUsername.js";
async function equipment(parsedCommand, user) {
    try {
        let eqAndWeapons = [...WEARABLE_LOCATION_VALUES, "weapon1", "weapon2"];
        let equipmentArray = [];
        eqAndWeapons.forEach((location) => {
            let itemInSlot = user.equipped[location];
            let arrayItem;
            if (itemInSlot) {
                arrayItem = [
                    `${location.charAt(0).toUpperCase() + location.slice(1).padEnd(9, ` `)}`,
                    `${itemInSlot.name}`
                ];
            }
            else {
                arrayItem = [`${location.charAt(0).toUpperCase() + location.slice(1).padEnd(9, ` `)}`, `nothing`];
            }
            equipmentArray.push(arrayItem);
        });
        messageToUsername(user.username, `You're equipped with:`, `success`);
        worldEmitter.emit(`equipmentArrayFor${user.username}`, equipmentArray);
    }
    catch (error) {
        catchErrorHandlerForFunction(`equipped`, error, user?.name);
    }
}
export default equipment;
