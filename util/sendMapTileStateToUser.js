// sendMapTileStateToUser
// packs and sends a user a mapTileState for a given room (e.g. MAP command or other map updates)
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
async function sendMapTileStateToUser(user, zoneFloorName, mapTileState) {
    try {
        worldEmitter.emit(`mapTileStateFor${user.username}`, zoneFloorName, mapTileState);
    }
    catch (error) {
        catchErrorHandlerForFunction(`sendMapTileStateToUser`, error, user?.name);
    }
}
export default sendMapTileStateToUser;
