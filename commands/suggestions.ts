// suggestions
// shows author the list of suggestions for the zone they're in
import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import catchErrorHandlerForFunction from "../util/catchErrorHandlerForFunction.js";
import getItemBlueprintNamesFromZone from "../util/getItemBlueprintNamesFromZone.js";
import getMobBlueprintNamesFromZone from "../util/getMobBlueprintNamesFromZone.js";
import getRoomNamesFromZone from "../util/getRoomNamesFromZone.js";
import getZoneOfUser from "../util/getZoneofUser.js";
import makeMessage from "../util/makeMessage.js";
import help from "./help.js";

async function suggestions(user: IUser) {
  try {
    const zone = await getZoneOfUser(user);
    if (!zone) {
      throw new Error(`Couldn't get ${user.username}'s zone.`);
    }

    if (zone.author.toString() !== user._id.toString()) {
      worldEmitter.emit(
        `messageFor${user.username}`,
        makeMessage("rejection", `You're not an author of this zone.`)
      );
      return;
    }
    help(
      {
        commandWord: "help",
        directObject: "suggestions",
      },
      user
    );
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
