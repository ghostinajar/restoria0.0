// map
// sends user mapTileState (map tile + wall/exit states) for their current room
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import messageToUsername from "../util/messageToUsername.js";
async function map(parsedCommand, user) {
    try {
        let directObject = parsedCommand.directObject?.toLowerCase();
        // handle invalid parameters (we can only use undefined, ON, OFF, or a number)
        if (directObject !== undefined &&
            directObject.toString() !== "off" &&
            directObject.toString() !== "on" &&
            isNaN(Number(directObject))) {
            messageToUsername(user.username, `Try MAP (on its own), MAP ON, MAP OFF, or MAP 7 (changes map radius to 7).`, `help`);
            messageToUsername(user.username, `Read HELP MAP to learn more.`, `help`);
            return;
        }
        // handle a number parameter
        if (!isNaN(Number(directObject))) {
            let newMapRadius = Number(directObject);
            if (newMapRadius > 10) {
                directObject = "10";
            }
            else if (newMapRadius < 1) {
                directObject = "1";
            }
            messageToUsername(user.username, `MAP radius set to ${newMapRadius}! It can be any number from 1-10.`, `help`);
            user.preferences.mapRadius = newMapRadius;
        }
        // handle "on" or "off" parameter
        if (parsedCommand.directObject?.toLowerCase() === "off") {
            user.preferences.autoMap = false;
            messageToUsername(user.username, `Auto MAP is OFF.`, `help`);
        }
        if (parsedCommand.directObject?.toLowerCase() === "on") {
            user.preferences.autoMap = true;
            messageToUsername(user.username, `Auto MAP is ON.`, `help`);
        }
        console.log(user.preferences);
        const room = await getRoomOfUser(user);
        if (!room) {
            throw new Error("map command couldn't find user's room.");
        }
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error("map command couldn't find user's zone.");
        }
        const zoneFloorName = `${zone.name} Floor ${room.mapCoords[2]}`;
        const mapTileState = {
            mapCoords: room.mapCoords,
            mapTile: room.mapTile,
            walls: {
                north: "?",
                east: "?",
                south: "?",
                west: "?",
            },
        };
        // populate walls
        const directions = ["north", "east", "south", "west"];
        directions.forEach((direction) => {
            if (room.exits[direction]) {
                if (room.exits[direction].isClosed) {
                    mapTileState.walls[direction] = "closed";
                }
                else {
                    mapTileState.walls[direction] = "open";
                }
                if (room.exits[direction].hiddenByDefault) {
                    mapTileState.walls[direction] = "wall";
                }
            }
            else {
                mapTileState.walls[direction] = "wall";
            }
        });
        worldEmitter.emit(`mapRequestFor${user.username}`, zoneFloorName, mapTileState);
    }
    catch (error) {
        catchErrorHandlerForFunction(`map`, error, user?.name);
    }
}
export default map;
