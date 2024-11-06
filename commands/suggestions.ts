import { IUser } from "../model/classes/User.js";
import worldEmitter from "../model/classes/WorldEmitter.js";
import getItemBlueprintNamesFromZone from "../util/getItemBlueprintNamesFromZone.js";
import getMobBlueprintNamesFromZone from "../util/getMobBlueprintNamesFromZone.js";
import getRoomNamesFromZone from "../util/getRoomNamesFromZone.js";
import getZoneOfUser from "../util/getZoneofUser.js";

async function suggestions(user: IUser) {
  const zone = await getZoneOfUser(user);
  worldEmitter.emit(`formPromptFor${user.username}`, {
    form: `suggestionsForm`,
    suggestions: zone.suggestions,
    itemBlueprintNames: getItemBlueprintNamesFromZone(zone),
    mobBlueprintNames: getMobBlueprintNamesFromZone(zone),
    roomNames: getRoomNamesFromZone(zone),
  });
}

export default suggestions;
