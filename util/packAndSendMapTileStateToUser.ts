// packAndSendMapTileStateToUser
// packs the mapTileState for a room and sends it to a user
// It's important to take the room as a parameter (instead of just deriving user's location)
// because sometimes we pack and send mapTileStates for adjacent rooms

import { IRoom } from "../model/classes/Room.js";
import { IUser } from "../model/classes/User.js";
import { IZone } from "../model/classes/Zone.js";
import catchErrorHandlerForFunction from "./catchErrorHandlerForFunction.js";
import packMapTileStateForRoom from "./packMapTileStateForRoom.js";
import sendMapTileStateToUser from "./sendMapTileStateToUser.js";

async function packAndSendMapTileStateToUser(user: IUser, room: IRoom, zone:IZone) {
  try {
    const mapTileState = await packMapTileStateForRoom(room);
    if (!mapTileState) {
      throw new Error(
        `couldn't get valid mapTileState for room ${room._id}`
      );
    }
    const zoneFloorName = `${zone.name} Floor ${room.mapCoords[2]}`;
    await sendMapTileStateToUser(user, zoneFloorName, mapTileState);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`packAndSendMapTileStateToUser`, error, user?.name);
  }
}

export default packAndSendMapTileStateToUser;