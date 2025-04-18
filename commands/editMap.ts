// editMap
// saves user entry from EDIT MAP command (map tile details)
import { IMapTile } from "../model/classes/Room.js";
import { IUser } from "../model/classes/User.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import messageToUsername from "../util/messageToUsername.js";
import map from "./map.js";

async function editMap(editMapData: IMapTile, user: IUser) {
  try {
    console.log(`user ${user.name} submitted edit map with data:`);
    console.log(editMapData);
    const room = await getRoomOfUser(user);
    if (!room) {
      console.log(`couldn't find room for ${user.name}`);
      return;
    }
    room.mapTile = editMapData;

    const zone = await getZoneOfUser(user);
    if (!zone) {
      console.log(`couldn't find zone for ${user.name}`);
      return;
    }

    messageToUsername(user.username, `Map updated for this room!`, `success`, true);
    await zone.save();
    await map({ commandWord: "map" }, user);
  } catch (error: unknown) {
    catchErrorHandlerForFunction(`editMap`, error, user?.name);
  }
}

export default editMap;
