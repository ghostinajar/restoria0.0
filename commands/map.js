// map
// sends user mapTileState (map tile + wall/exit states) for their current room
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
async function map(user) {
    try {
        const room = await getRoomOfUser(user);
        if (!room) {
            throw new Error("map command couldn't find user's room.");
        }
        const zone = await getZoneOfUser(user);
        if (!zone) {
            throw new Error("map command couldn't find user's zone.");
        }
        const mapTileState = {
            zone: zone.name,
            mapCoords: room.mapCoords,
            mapTile: room.mapTile,
            north: "?",
            east: "?",
            south: "?",
            west: "?",
        };
        const directions = ["north", "east", "south", "west"];
        directions.forEach((direction) => {
            if (room.exits[direction]) {
                if (room.exits[direction].isClosed) {
                    mapTileState[direction] = "closed";
                }
                else {
                    mapTileState[direction] = "open";
                }
            }
            else {
                mapTileState[direction] = "wall";
            }
        });
        worldEmitter.emit(`mapTileStateFor${user.username}`, mapTileState);
    }
    catch (error) {
        catchErrorHandlerForFunction(`map`, error, user?.name);
    }
}
export default map;
