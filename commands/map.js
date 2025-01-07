// map
// sends user mapTileState (map tile + wall/exit states) for their current room
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
        };
        //TODO use exit info to construct wall data for tile
        //TODO send mapTileState to client
    }
    catch (error) {
        catchErrorHandlerForFunction(`map`, error, user?.name);
    }
}
export default map;
