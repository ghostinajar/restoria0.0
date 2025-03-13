// sendMapTileStateToUser
// packs and sends a user a mapTileState for a given room (e.g. MAP command or other map updates)

import { IMapTileState } from "../commands/map.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";

async function sendMapTileStateToUser(
  user: IUser,
  zoneFloorName: string,
  mapTileState: IMapTileState,
) {
  try {
    worldEmitter.emit(
      `mapTileStateFor${user.username}`,
      zoneFloorName,
      mapTileState,
    );
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`sendMapTileStateToUser`, error, user?.name);
  }
}

export default sendMapTileStateToUser;
