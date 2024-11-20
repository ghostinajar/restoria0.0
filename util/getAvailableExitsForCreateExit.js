// getAvailableExitsForCreateExit
// returns an array of directions strings for which exits can be
// opened between the user's room and existing adjacent rooms
import { directions } from "../constants/DIRECTIONS.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import coordsOccupiedInZone from "./coordsOccupiedInZone.js";
import getMapCoordsInDirection from "./getMapCoordsInDirection.js";
import getRoomOfUser from "./getRoomOfUser.js";
import getZoneOfUser from "./getZoneofUser.js";
async function getAvailableExitsForCreateExit(user) {
    try {
        let availableExits = [];
        const room = await getRoomOfUser(user);
        if (!room) {
            throw new Error(`Room not found for ${user.name}`);
        }
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`Zone not found for ${user.name}`);
        }
        directions.forEach((direction) => {
            let potentialMapCoordsOfNewRoom = getMapCoordsInDirection(direction, room.mapCoords);
            if (coordsOccupiedInZone(zone, potentialMapCoordsOfNewRoom) && room.exits[direction] === null) {
                availableExits.push(direction);
            }
        });
        return availableExits;
    }
    catch (error) {
        catchErrorHandlerForFunction(`getAvailableExitsForCreateExit`, error, user?.name);
    }
}
export default getAvailableExitsForCreateExit;
