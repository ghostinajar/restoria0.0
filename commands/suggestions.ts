// suggestions
// shows author the list of suggestions for the zone they're in
import logger from "../logger.js";
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getItemBlueprintNamesFromZone from "../util/getItemBlueprintNamesFromZone.js";
import getMobBlueprintNamesFromZone from "../util/getMobBlueprintNamesFromZone.js";
import getRoomNamesFromZone from "../util/getRoomNamesFromZone.js";
import getZoneOfUser from "../util/getZoneofUser.js";

async function suggestions(user: IUser) {
  try {
    const zone = await getZoneOfUser(user);
    worldEmitter.emit(`formPromptFor${user.username}`, {
      form: `suggestionsForm`,
      suggestions: zone.suggestions,
      itemBlueprintNames: getItemBlueprintNamesFromZone(zone),
      mobBlueprintNames: getMobBlueprintNamesFromZone(zone),
      roomNames: getRoomNamesFromZone(zone),
    });
  } catch (error: unknown) {
    catchErrorHandlerForFunction("suggestions", error, user.name);
  }
}

export default suggestions;
