// autoMap
// sends mapTileState or full mapRequest to user based on user's autoMap preference
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import packMapTileStateForRoom from "../util/packMapTileStateForRoom.js";

async function autoMap(user: IUser) {
  try {
    const zone = await getZoneOfUser(user);
    const room = await getRoomOfUser(user);
    if (!zone || !room) {
      throw new Error(`zone or room not found for ${user.username}`);
    }
    const zoneFloorName = `${zone.name} Floor ${room.mapCoords[2]}`;
    const mapTileState = await packMapTileStateForRoom(room);

    if (user.preferences.autoMap) {
      worldEmitter.emit(
        `mapRequestFor${user.username}`,
        zoneFloorName,
        mapTileState,
      );
    } else {
      worldEmitter.emit(
        `mapTileStateFor${user.username}`,
        zoneFloorName,
        mapTileState,
      );
    }
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`autoMap`, error, user?.name);
  }
}

export default autoMap;