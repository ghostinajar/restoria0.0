import { IRoom } from "../model/classes/Room.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import { IZone } from "../model/classes/Zone.js";
import makeMessage from "../types/makeMessage.js";
import getItemBlueprintNamesFromZone from "../util/getItemBlueprintNamesFromZone.js";
import getMobBlueprintNamesFromZone from "../util/getMobBlueprintNamesFromZone.js";
import getRoomNamesFromZone from "../util/getRoomNamesFromZone.js";
import getRoomOfUser from "../util/getRoomOfUser.js";
import getZoneOfUser from "../util/getZoneofUser.js";

async function erase(user: IUser) {
  const zone: IZone = await getZoneOfUser(user);
  const room: IRoom = await getRoomOfUser(user);

  if (zone.author.toString() !== user._id.toString()) {
    worldEmitter.emit(
      `messageFor${user.username}`,
      makeMessage(`rejection`, `You aren't an author for this zone.`)
    );
    return;
  }

  const roomNames = getRoomNamesFromZone(zone);
  //TODO derive exitNames from roomNames and room.exits
  const exitNames = {};

  worldEmitter.emit(`formPromptFor${user.username}`, {
    form: `eraseForm`,
    itemBlueprintNames: getItemBlueprintNamesFromZone(zone),
    mobBlueprintNames: getMobBlueprintNamesFromZone(zone),
    exitNames: exitNames,
  });
}

export default erase;
