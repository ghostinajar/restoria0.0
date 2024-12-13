import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import coordsOccupiedInZone from "./coordsOccupiedInZone.js";
import getMapCoordsInDirection from "./getMapCoordsInDirection.js";
import getRoomOfUser from "./getRoomOfUser.js";
import getZoneOfUser from "./getZoneofUser.js";
async function getAvailableExitsForCreateRoom(user) {
    try {
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error(`Zone not found for user ${user.name}`);
        }
        const room = await getRoomOfUser(user);
        if (!room) {
            throw new Error(`Room not found for user ${user.name}`);
        }
        let availableExitsArray = ["north", "east", "south", "west", "up", "down"];
        //check origin room's map coords, filter directions for out of bounds options
        if (room.mapCoords[0] == 0) {
            availableExitsArray = availableExitsArray.filter((exit) => exit !== "west");
        }
        if (room.mapCoords[0] == 79) {
            availableExitsArray = availableExitsArray.filter((exit) => exit !== "east");
        }
        if (room.mapCoords[1] == 0) {
            availableExitsArray = availableExitsArray.filter((exit) => exit !== "north");
        }
        if (room.mapCoords[1] == 79) {
            availableExitsArray = availableExitsArray.filter((exit) => exit !== "south");
        }
        if (room.mapCoords[2] == 10) {
            availableExitsArray = availableExitsArray.filter((exit) => exit !== "up");
        }
        if (room.mapCoords[2] == -10) {
            availableExitsArray = availableExitsArray.filter((exit) => exit !== "down");
        }
        //iterate over room's used exits to filter from availableExitsArray
        for (let [key, value] of Object.entries(room.exits)) {
            if (value &&
                key !== "$__parent" &&
                key !== "$__" &&
                key !== "$isNew" &&
                key !== "$__v" &&
                key !== "$_id" &&
                key !== "_doc") {
                switch (key) {
                    case "north": {
                        availableExitsArray = availableExitsArray.filter((exit) => exit !== "north");
                        break;
                    }
                    case "east": {
                        availableExitsArray = availableExitsArray.filter((exit) => exit !== "east");
                        break;
                    }
                    case "south": {
                        availableExitsArray = availableExitsArray.filter((exit) => exit !== "south");
                        break;
                    }
                    case "west": {
                        availableExitsArray = availableExitsArray.filter((exit) => exit !== "west");
                        break;
                    }
                    case "up": {
                        availableExitsArray = availableExitsArray.filter((exit) => exit !== "up");
                        break;
                    }
                    case "down": {
                        availableExitsArray = availableExitsArray.filter((exit) => exit !== "down");
                        break;
                    }
                    default:
                        break;
                }
            }
        }
        // check each availableExitsArray's potential mapCoords, and only add to
        // availableDirectionsArray if coords are unoccupied
        let availableDirectionsArray = [];
        availableExitsArray.forEach((direction) => {
            let potentialMapCoordsOfNewRoom = getMapCoordsInDirection(direction, room.mapCoords);
            if (!coordsOccupiedInZone(zone, potentialMapCoordsOfNewRoom)) {
                availableDirectionsArray.push(direction);
            }
        });
        return availableDirectionsArray;
    }
    catch (error) {
        catchErrorHandlerForFunction(`getAvailableExitsForCreateRoom`, error, user?.name);
        return [];
    }
}
export default getAvailableExitsForCreateRoom;
